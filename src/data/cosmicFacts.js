/**
 * AstroQuest Cosmic Factoids Library
 * Kid-friendly astronomical discoveries, planetary science, and space trivia
 * for display during question transitions and loading screens.
 */

export const COSMIC_FACTS = [
	{
		id: 1,
		emoji: '🪐',
		fact: 'One day on Venus is longer than a whole year on Venus! It spins so slowly that it takes 243 Earth days to rotate just once.',
		topic: 'Venus',
	},
	{
		id: 2,
		emoji: '☀️',
		fact: 'You could fit about 1.3 million Earths inside our Sun! The Sun makes up 99.8% of all the mass in the Solar System.',
		topic: 'The Sun',
	},
	{
		id: 3,
		emoji: '👣',
		fact: 'Footprints left on the Moon by Apollo astronauts will stay there for millions of years because the Moon has no wind or rain to wash them away!',
		topic: 'The Moon',
	},
	{
		id: 4,
		emoji: '💎',
		fact: 'On Neptune and Uranus, scientists believe it literally rains diamonds deep inside their icy gas atmospheres!',
		topic: 'Neptune & Uranus',
	},
	{
		id: 5,
		emoji: '🌋',
		fact: 'Mars is home to Olympus Mons, the largest volcano in the Solar System—it is nearly 3 times taller than Mount Everest!',
		topic: 'Mars',
	},
	{
		id: 6,
		emoji: '🌌',
		fact: 'The Milky Way galaxy is shaped like a giant spinning spiral pinwheel and contains between 100 to 400 billion stars!',
		topic: 'Milky Way',
	},
	{
		id: 7,
		emoji: '❄️',
		fact: "Saturn's dazzling rings are not solid—they are made of billions of pieces of water ice, rock, and stardust ranging from tiny pebbles to city-sized icebergs!",
		topic: "Saturn's Rings",
	},
	{
		id: 8,
		emoji: '🚀',
		fact: 'The International Space Station travels so fast (17,500 mph) that astronauts on board see 16 sunrises and 16 sunsets every single day!',
		topic: 'Space Station',
	},
	{
		id: 9,
		emoji: '🌪️',
		fact: "Jupiter's Great Red Spot is a giant cosmic storm that is bigger than planet Earth and has been swirling for hundreds of years!",
		topic: 'Jupiter',
	},
	{
		id: 10,
		emoji: '⭐',
		fact: 'Neutron stars are so dense that just a single sugar-cube-sized spoonful of one would weigh about 1 billion tons on Earth!',
		topic: 'Neutron Stars',
	},
	{
		id: 11,
		emoji: '🛰️',
		fact: 'Voyager 1 is the farthest human-made object from Earth—it has traveled over 15 billion miles and is now exploring interstellar space!',
		topic: 'Voyager 1',
	},
	{
		id: 12,
		emoji: '🌊',
		fact: "Europa, one of Jupiter's moons, has a gigantic salty ocean hidden beneath its icy crust that holds more water than all of Earth's oceans combined!",
		topic: 'Europa',
	},
	{
		id: 13,
		emoji: '☄️',
		fact: "Comet tails always point away from the Sun, no matter which direction the comet is traveling, pushed by the Sun's solar wind!",
		topic: 'Comets',
	},
	{
		id: 14,
		emoji: '🌑',
		fact: 'Space is completely silent! Because there is no air or atmosphere in space, sound waves have no medium to travel through.',
		topic: 'Cosmic Silence',
	},
	{
		id: 15,
		emoji: '🔭',
		fact: 'The James Webb Space Telescope has giant gold-coated mirrors that can detect faint infrared heat from galaxies formed over 13.5 billion years ago!',
		topic: 'James Webb Telescope',
	},
	{
		id: 16,
		emoji: '🌠',
		fact: 'Shooting stars are not actually stars at all! They are tiny grains of cosmic rock or dust burning up brightly as they enter Earth’s atmosphere.',
		topic: 'Meteors',
	},
	{
		id: 17,
		emoji: '🛸',
		fact: 'If you could drive a car straight up into space at 60 mph, you would reach space in only about one hour!',
		topic: 'Edge of Space',
	},
	{
		id: 18,
		emoji: '🌞',
		fact: 'Sunlight takes about 8 minutes and 20 seconds to travel 93 million miles through space to reach your eyes on Earth!',
		topic: 'Speed of Light',
	},
	{
		id: 19,
		emoji: '🔵',
		fact: 'Uranus is the only planet in our Solar System that spins on its side, like a rolling ball, likely due to a colossal collision long ago!',
		topic: 'Uranus',
	},
	{
		id: 20,
		emoji: '✨',
		fact: 'Every single atom of calcium in your bones and iron in your blood was forged inside exploding ancient stars billions of years ago—you are made of stardust!',
		topic: 'Stardust',
	},
];

/**
 * Returns a random cosmic factoid
 */
export function getRandomCosmicFact(excludeId = null) {
	const available =
		excludeId ? COSMIC_FACTS.filter((f) => f.id !== excludeId) : COSMIC_FACTS;
	const index = Math.floor(Math.random() * available.length);
	return available[index] || COSMIC_FACTS[0];
}
