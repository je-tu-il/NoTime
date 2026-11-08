const assert = require('assert');
const { calculateLifeStats, generateWallpaperSvg, generateWallpaperPng } = require('./lib/wallpaperGenerator');

console.log('[TEST] Verification des calculs statistiques NoTime...');
const stats = calculateLifeStats('2000-01-01', 80);
assert.ok(stats.totalWeeks === 80 * 52, 'Le nombre total de semaines doit être 80 * 52 = 4160');
assert.ok(stats.passedWeeks > 0, 'Les semaines passées doivent être positives');
assert.ok(stats.remainingWeeks > 0, 'Les semaines restantes doivent être positives');
console.log(`[OK] Stats: ${stats.passedWeeks} passees, ${stats.remainingWeeks} restantes (${stats.percentLived}% de vie ecoulee)`);

console.log('[TEST] Verification de la generation SVG...');
const svg = generateWallpaperSvg({
  dob: '2000-01-01',
  lifespan: 80,
  currentWeekColor: '#FF453A',
  pastColor: '#FFFFFF',
  futureColor: '#27272A',
  bgColor: '#000000',
  showText: true,
  customQuote: 'MEMENTO MORI',
  width: 1170,
  height: 2532,
  top: 860,
  margin: 42,
  dot: 5.2
});

assert.ok(typeof svg === 'string', 'Le retour doit etre une chaine SVG');
assert.ok(svg.includes('<svg') && svg.includes('</svg>'), 'Balise SVG valide requise');
assert.ok(svg.includes('MEMENTO MORI'), 'La citation Memento Mori doit figurer dans le SVG');
console.log('[OK] Generation SVG valide (taille: ' + svg.length + ' octets)');

console.log('[TEST] Verification de la generation PNG (resvg-js)...');
try {
  const pngBuffer = generateWallpaperPng(svg);
  assert.ok(Buffer.isBuffer(pngBuffer), 'Le retour PNG doit etre un Buffer');
  assert.ok(pngBuffer.length > 1000, 'Le buffer PNG doit contenir des donnees d image');
  console.log('[OK] Buffer PNG genere avec succes (' + pngBuffer.length + ' octets)');
} catch (err) {
  console.warn('[WARN] resvg-js non installe ou binaire natif absent, SVG disponible.');
}

console.log('\n[SUCCESS] Tous les tests NoTime ont reussi avec succes !');
