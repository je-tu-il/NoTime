const { Resvg } = require('@resvg/resvg-js');

/**
 * Calculates weeks lived and total weeks.
 */
function calculateLifeStats(dobStr, lifespanYears = 80, targetDate = new Date()) {
  const parts = (dobStr || '2000-01-01').split('-').map(Number);
  const y = parts[0] || 2000;
  const m = parts[1] || 1;
  const d = parts[2] || 1;
  const birth = new Date(Date.UTC(y, m - 1, d));
  const now = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));

  const diffMs = now.getTime() - birth.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const passedWeeks = Math.floor(totalDays / 7);

  const cols = 52;
  const rows = Math.max(10, Math.min(120, parseInt(lifespanYears, 10) || 80));
  const totalWeeks = cols * rows;

  const boundedPassed = Math.min(passedWeeks, totalWeeks);
  const remainingWeeks = Math.max(0, totalWeeks - boundedPassed);
  const percentLived = ((boundedPassed / totalWeeks) * 100).toFixed(1);

  // Approximate age in years and months
  const ageYears = Math.floor(totalDays / 365.25);
  const ageMonths = Math.floor((totalDays % 365.25) / 30.4375);

  return {
    birth,
    totalDays,
    passedWeeks: boundedPassed,
    rawPassedWeeks: passedWeeks,
    remainingWeeks,
    totalWeeks,
    percentLived,
    ageYears,
    ageMonths,
    cols,
    rows
  };
}

/**
 * Generates an SVG string of the Memento Mori wallpaper.
 */
function generateWallpaperSvg(options = {}) {
  const {
    dob = '2000-01-01',
    lifespan = 80,
    currentWeekColor = '#FF453A',
    pastColor = '#FFFFFF',
    futureColor = '#27272A',
    bgColor = '#000000',
    showText = true,
    customTitle = '',
    customQuote = 'MEMENTO MORI',
    width = 1290,
    height = 2796
  } = options;

  const stats = calculateLifeStats(dob, lifespan);
  const { cols, rows, totalWeeks, passedWeeks, percentLived } = stats;

  // Safe area for iPhone Lock Screen:
  // Top: ~680px (Dynamic Island + Large Clock + Lockscreen Widgets)
  // Bottom: ~380px (Flashlight & Camera buttons + Home bar)
  const topSafe = 680;
  const bottomSafe = 380;
  const availableHeight = height - topSafe - bottomSafe;

  const horizontalMargin = 95;
  const availableWidth = width - horizontalMargin * 2;

  // Perfect square grid calculation
  const step = Math.min(availableWidth / (cols - 1), availableHeight / (rows - 1));
  const gridWidth = (cols - 1) * step;
  const gridHeight = (rows - 1) * step;

  const startX = (width - gridWidth) / 2;
  const startY = topSafe + (availableHeight - gridHeight) / 2;
  const radius = (step * 0.18).toFixed(2);

  // Generate dots
  const circles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const cx = (startX + c * step).toFixed(1);
      const cy = (startY + r * step).toFixed(1);

      let color = futureColor;
      let rVal = radius;

      if (idx < passedWeeks) {
        color = pastColor;
      } else if (idx === passedWeeks) {
        color = currentWeekColor || pastColor;
        rVal = (Number(radius) * 1.25).toFixed(2); // slightly larger current dot
      }

      circles.push(`<circle cx="${cx}" cy="${cy}" r="${rVal}" fill="${color}"/>`);
    }
  }

  // Footer labels
  let footerSvg = '';
  if (showText) {
    const textBaseY = startY + gridHeight + 70;
    const statsText = customTitle || `SEMAINE ${passedWeeks.toLocaleString('fr-FR')} / ${totalWeeks.toLocaleString('fr-FR')}  •  ${percentLived}% VÉCU`;

    footerSvg = `
      <text x="${width / 2}" y="${textBaseY}" text-anchor="middle" fill="#8E8E93" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="600" letter-spacing="2">
        ${statsText}
      </text>
      ${customQuote ? `
      <text x="${width / 2}" y="${textBaseY + 45}" text-anchor="middle" fill="#545458" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" letter-spacing="4">
        ${customQuote}
      </text>` : ''}
    `;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <g id="grid">
    ${circles.join('')}
  </g>
  ${footerSvg}
</svg>
  `.trim();
}

/**
 * Generates PNG buffer from wallpaper options.
 */
function generateWallpaperPng(options = {}) {
  const svg = generateWallpaperSvg(options);
  const width = options.width || 1290;
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width }
  });
  return resvg.render().asPng();
}

module.exports = {
  calculateLifeStats,
  generateWallpaperSvg,
  generateWallpaperPng
};
