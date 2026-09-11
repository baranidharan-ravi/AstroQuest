import react from '@vitejs/plugin-react';
import net from 'node:net';
import { defineConfig } from 'vite';

let isServerAlive = null;
let lastCheckTime = 0;

function checkServerListening(port = 5001, timeout = 250) {
	const now = Date.now();
	// Cache status for 3 seconds to avoid unnecessary socket checks
	if (isServerAlive !== null && now - lastCheckTime < 3000) {
		return Promise.resolve(isServerAlive);
	}

	return new Promise((resolve) => {
		const socket = new net.Socket();
		socket.setTimeout(timeout);

		socket.once('connect', () => {
			isServerAlive = true;
			lastCheckTime = Date.now();
			socket.destroy();
			resolve(true);
		});

		socket.once('timeout', () => {
			isServerAlive = false;
			lastCheckTime = Date.now();
			socket.destroy();
			resolve(false);
		});

		socket.once('error', () => {
			isServerAlive = false;
			lastCheckTime = Date.now();
			socket.destroy();
			resolve(false);
		});

		socket.connect(port, '127.0.0.1');
	});
}

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	server: {
		port: 3000,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5001',
				changeOrigin: true,
				bypass: async (req, res) => {
					const alive = await checkServerListening(5001);
					if (!alive) {
						// Express proxy server is not running on port 5001
						if (req.url === '/api/health') {
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.end(
								JSON.stringify({
									status: 'standalone',
									proxy: false,
									message:
										'AstroQuest running in direct client mode (Express server offline)',
								}),
							);
							return false; // Handled cleanly, suppress ECONNREFUSED
						}

						res.writeHead(503, { 'Content-Type': 'application/json' });
						res.end(
							JSON.stringify({
								error:
									'Express proxy server is not running on port 5001. Operating in client-direct mode.',
								proxy: false,
							}),
						);
						return false;
					}
				},
				configure: (proxy) => {
					proxy.on('error', (err, _req, res) => {
						if (res && !res.headersSent) {
							res.writeHead(503, { 'Content-Type': 'application/json' });
							res.end(
								JSON.stringify({
									error: 'Proxy connection error',
									message: err.message,
									proxy: false,
								}),
							);
						}
					});
				},
			},
		},
	},
	build: {
		target: 'es2022',
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom'],
					'vendor-icons': ['lucide-react'],
					'vendor-ai': ['@google/genai', 'axios'],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
