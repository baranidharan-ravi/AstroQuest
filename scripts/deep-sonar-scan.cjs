const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const srcDir = path.resolve(__dirname, '../src');

function getAllFiles(dir, exts = ['.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getAllFiles(srcDir);
const sonarqubeIssues = [];

for (const filePath of allFiles) {
  const relPath = path.relative(srcDir, filePath).replace(/\\/g, '/');
  const code = fs.readFileSync(filePath, 'utf-8');
  const lines = code.split('\n');

  // Check 1: Commented out code (S125)
  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (
      trimmed.startsWith('//') &&
      !trimmed.startsWith('///') &&
      (
        /\/\/\s*(const|let|var|function|return|import|export|if\s*\(|for\s*\(|while\s*\(|<[A-Z][A-Za-z0-9]*|<div|<button|<span)\b/.test(trimmed)
      )
    ) {
      sonarqubeIssues.push({
        file: relPath,
        line: idx + 1,
        code: 'javascript:S125',
        level: 'Easy',
        message: `Remove commented out code: "${trimmed.slice(0, 50)}..."`
      });
    }
  });

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
  } catch (err) {
    console.error(`Error parsing ${relPath}: ${err.message}`);
    continue;
  }

  // Check 2: Unused imports (S1128)
  const importedIdentifiers = new Map();
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration') {
      for (const spec of node.specifiers) {
        importedIdentifiers.set(spec.local.name, {
          line: spec.loc.start.line,
          source: node.source.value
        });
      }
    }
  }

  const referencedIds = new Set();
  traverse(ast, {
    ReferencedIdentifier(p) {
      referencedIds.add(p.node.name);
    },
    JSXOpeningElement(p) {
      if (p.node.name.type === 'JSXIdentifier') {
        referencedIds.add(p.node.name.name);
      } else if (p.node.name.type === 'JSXMemberExpression') {
        let root = p.node.name;
        while (root.object) root = root.object;
        if (root.name) referencedIds.add(root.name);
      }
    }
  });

  for (const [importName, info] of importedIdentifiers) {
    if (importName === 'React') {
      if (!referencedIds.has('React')) {
        sonarqubeIssues.push({
          file: relPath,
          line: info.line,
          code: 'javascript:S1128',
          level: 'Easy',
          message: `Unused import 'React'.`
        });
      }
      continue;
    }
    if (!referencedIds.has(importName)) {
      sonarqubeIssues.push({
        file: relPath,
        line: info.line,
        code: 'javascript:S1128',
        level: 'Easy',
        message: `Unused import '${importName}' from '${info.source}'.`
      });
    }
  }

  // Check 3: S6819: role="dialog" or role="button" used on div/span/etc.
  // Check 4: S6847 / S1082: onClick on non-interactive elements without role or keyboard
  // Check 5: S3358: Nested ternary operations
  // Check 6: S6772: Ambiguous whitespace around JSX elements
  // Check 7: S6842: positive tabIndex
  // Check 8: S6759: Redundant Boolean() call

  traverse(ast, {
    // S3358: Nested conditional expressions (ternaries)
    ConditionalExpression(p) {
      const parent = p.parent;
      if (parent.type === 'ConditionalExpression') {
        sonarqubeIssues.push({
          file: relPath,
          line: p.node.loc.start.line,
          code: 'javascript:S3358',
          level: 'Hard',
          message: 'Extract this nested ternary operation into an independent statement.'
        });
      }
    },

    JSXElement(elemPath) {
      const opening = elemPath.node.openingElement;
      if (opening.name.type === 'JSXIdentifier') {
        const tagName = opening.name.name.toLowerCase();
        let roleVal = null;
        let hasOnClick = false;
        let hasOnKeyDown = false;
        let tabIndexVal = null;
        let tabIndexLine = null;

        for (const attr of opening.attributes) {
          if (attr.type === 'JSXAttribute' && attr.name && attr.name.type === 'JSXIdentifier') {
            const attrName = attr.name.name;
            if (attrName === 'role' && attr.value && attr.value.type === 'StringLiteral') {
              roleVal = attr.value.value;
            }
            if (attrName === 'onClick') {
              hasOnClick = true;
            }
            if (attrName === 'onKeyDown' || attrName === 'onKeyUp' || attrName === 'onKeyPress') {
              hasOnKeyDown = true;
            }
            if (attrName === 'tabIndex') {
              tabIndexLine = attr.loc ? attr.loc.start.line : opening.loc.start.line;
              if (attr.value) {
                if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'NumericLiteral') {
                  tabIndexVal = attr.value.expression.value;
                } else if (attr.value.type === 'StringLiteral') {
                  tabIndexVal = parseInt(attr.value.value, 10);
                }
              }
            }
          }
        }

        // S6819: role="dialog"
        if (roleVal === 'dialog' && tagName !== 'dialog') {
          sonarqubeIssues.push({
            file: relPath,
            line: opening.loc.start.line,
            code: 'javascript:S6819',
            level: 'Hard',
            message: `Use <dialog> instead of the "dialog" role to ensure accessibility across all devices.`
          });
        }

        // S6819: role="button"
        if (roleVal === 'button' && tagName !== 'button' && tagName !== 'input') {
          sonarqubeIssues.push({
            file: relPath,
            line: opening.loc.start.line,
            code: 'javascript:S6819',
            level: 'Hard',
            message: `Use <button> instead of <${tagName} role="button"> to ensure accessibility across all devices.`
          });
        }

        // S6847 / S1082: onClick on non-interactive elements like div, span, section without interactive role or button
        if (
          hasOnClick &&
          ['div', 'span', 'section', 'article', 'aside', 'p'].includes(tagName) &&
          roleVal !== 'button' &&
          roleVal !== 'tab' &&
          roleVal !== 'menuitem' &&
          roleVal !== 'checkbox' &&
          roleVal !== 'radio' &&
          roleVal !== 'option' &&
          roleVal !== 'switch'
        ) {
          sonarqubeIssues.push({
            file: relPath,
            line: opening.loc.start.line,
            code: 'javascript:S6847',
            level: 'Hard',
            message: `Non-interactive element <${tagName}> should not be assigned mouse or keyboard event listeners.`
          });
        }

        if (tabIndexVal !== null && tabIndexVal > 0) {
          sonarqubeIssues.push({
            file: relPath,
            line: tabIndexLine,
            code: 'javascript:S6842',
            level: 'Medium',
            message: `Do not use positive tabIndex values (${tabIndexVal}). Use 0 or -1.`
          });
        }
      }
    },

    // S6759: Redundant Boolean call on comparison
    CallExpression(callPath) {
      if (callPath.node.callee.type === 'Identifier' && callPath.node.callee.name === 'Boolean') {
        const arg = callPath.node.arguments[0];
        if (arg && (arg.type === 'BinaryExpression' && ['===', '!==', '==', '!=', '>', '<', '>=', '<='].includes(arg.operator))) {
          sonarqubeIssues.push({
            file: relPath,
            line: callPath.node.loc.start.line,
            code: 'javascript:S6759',
            level: 'Medium',
            message: `Redundant Boolean() wrapper on comparison expression (${arg.operator}).`
          });
        }
      }
    }
  });
}

console.log(`\n======================================================`);
console.log(`TOTAL SONARQUBE PROBLEMS FOUND: ${sonarqubeIssues.length}`);
console.log(`======================================================\n`);

const easy = sonarqubeIssues.filter(i => i.level === 'Easy');
const medium = sonarqubeIssues.filter(i => i.level === 'Medium');
const hard = sonarqubeIssues.filter(i => i.level === 'Hard');

console.log(`--- [EASY] Unused Imports & Commented-out Code: ${easy.length} items ---`);
easy.forEach(i => console.log(`  ${i.code} [${i.file}:${i.line}] ${i.message}`));

console.log(`\n--- [MEDIUM] Redundant Expressions & Accessibility Attributes: ${medium.length} items ---`);
medium.forEach(i => console.log(`  ${i.code} [${i.file}:${i.line}] ${i.message}`));

console.log(`\n--- [HARD] Accessibility & Complexity: ${hard.length} items ---`);
hard.forEach(i => console.log(`  ${i.code} [${i.file}:${i.line}] ${i.message}`));

