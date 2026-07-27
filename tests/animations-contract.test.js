const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('js/animations.js', 'utf8');

assert.match(source, /class IGrAnimations/);
assert.match(source, /initHeroReveal\(\)/);
assert.match(source, /prefers-reduced-motion/);
assert.doesNotMatch(source, /initHeroPinned\(\)/);

console.log('animation contract passed');
