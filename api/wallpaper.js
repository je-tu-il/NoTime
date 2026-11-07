const { generateWallpaperPng, generateWallpaperSvg, calculateLifeStats } = require('../lib/wallpaperGenerator');

module.exports = async function handler(req, res) {
  try {
    const {
      dob = '2000-01-01',
      years = 80,
      lifespan,
      current = '#FF453A',
      past = '#FFFFFF',
      future = '#27272A',
      bg = '#000000',
      text = 'true',
      quote = 'MEMENTO MORI',
      format = 'png',
      width = 1170, // iPhone 13 native
      height = 2532, // iPhone 13 native
      top = 860, // Clear of lockscreen clock
      margin = 42, // Zoomed in width (takes 93% of screen)
      dot = 5.2 // Clear, larger dots
    } = req.query || {};

    const cleanHex = (val, fallback) => {
      if (!val) return fallback;
      if (val.toLowerCase() === 'none') return null;
      return val.startsWith('#') ? val : `#${val}`;
    };

    const options = {
      dob: String(dob),
      lifespan: parseInt(lifespan || years, 10) || 80,
      currentWeekColor: cleanHex(current, '#FF453A'),
      pastColor: cleanHex(past, '#FFFFFF'),
      futureColor: cleanHex(future, '#27272A'),
      bgColor: cleanHex(bg, '#000000'),
      showText: text === 'true' || text === '1',
      customQuote: quote ? String(quote) : '',
      width: parseInt(width, 10) || 1170,
      height: parseInt(height, 10) || 2532,
      top: parseInt(top, 10) || 860,
      margin: parseInt(margin, 10) || 42,
      dot: parseFloat(dot) || 5.2
    };

    if (format === 'json') {
      const stats = calculateLifeStats(options.dob, options.lifespan);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(stats);
    }

    if (format === 'svg') {
      const svg = generateWallpaperSvg(options);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400');
      return res.status(200).send(svg);
    }

    // Default: PNG for iPhone shortcut
    const pngBuffer = generateWallpaperPng(options);
    res.setHeader('Content-Type', 'image/png');
    // Cache for 6 hours so daily update at 6h gets fresh image
    res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).send(pngBuffer);
  } catch (err) {
    console.error('Wallpaper generation error:', err);
    res.status(500).json({ error: 'Failed to generate wallpaper', details: err.message });
  }
};
