document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const dobInput = document.getElementById('dob');
  const lifespanButtons = document.querySelectorAll('#lifespan-group .btn-toggle');
  const colorButtons = document.querySelectorAll('#color-options .color-btn');
  const showTextCheckbox = document.getElementById('show-text');

  const statAge = document.getElementById('stat-age');
  const statPassed = document.getElementById('stat-passed');
  const statLeft = document.getElementById('stat-left');
  const statPercent = document.getElementById('stat-percent');
  const progressBar = document.getElementById('progress-bar');

  const apiUrlInput = document.getElementById('api-url');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const wallpaperPreview = document.getElementById('wallpaper-preview');
  const mockupDate = document.getElementById('mockup-date');

  // State
  let state = {
    dob: dobInput.value || '1998-05-14',
    lifespan: 80,
    currentWeekColor: '#FF453A',
    showText: true
  };

  // Set today's date formatted for mockup
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(now);
  mockupDate.textContent = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // Calculate life stats
  function calculateStats(dobStr, lifespanYears) {
    const parts = (dobStr || '2000-01-01').split('-').map(Number);
    const y = parts[0] || 2000;
    const m = parts[1] || 1;
    const d = parts[2] || 1;
    const birth = new Date(Date.UTC(y, m - 1, d));
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const diffMs = today.getTime() - birth.getTime();
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const passedWeeks = Math.floor(totalDays / 7);

    const cols = 52;
    const rows = parseInt(lifespanYears, 10) || 80;
    const totalWeeks = cols * rows;

    const boundedPassed = Math.min(passedWeeks, totalWeeks);
    const remainingWeeks = Math.max(0, totalWeeks - boundedPassed);
    const percentLived = ((boundedPassed / totalWeeks) * 100).toFixed(1);

    const ageYears = Math.floor(totalDays / 365.25);
    const ageMonths = Math.floor((totalDays % 365.25) / 30.4375);

    return {
      totalDays,
      passedWeeks: boundedPassed,
      remainingWeeks,
      totalWeeks,
      percentLived,
      ageYears,
      ageMonths,
      cols,
      rows
    };
  }

  // Generate Client-Side SVG for instant preview
  function renderSvg(stats) {
    const width = 1290;
    const height = 2796;
    const { cols, rows, totalWeeks, passedWeeks, percentLived } = stats;

    const topSafe = 680;
    const bottomSafe = 380;
    const availableHeight = height - topSafe - bottomSafe;
    const horizontalMargin = 95;
    const availableWidth = width - horizontalMargin * 2;

    const step = Math.min(availableWidth / (cols - 1), availableHeight / (rows - 1));
    const gridWidth = (cols - 1) * step;
    const gridHeight = (rows - 1) * step;

    const startX = (width - gridWidth) / 2;
    const startY = topSafe + (availableHeight - gridHeight) / 2;
    const radius = (step * 0.18).toFixed(2);

    const circles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const cx = (startX + c * step).toFixed(1);
        const cy = (startY + r * step).toFixed(1);

        let color = '#27272A';
        let rVal = radius;

        if (idx < passedWeeks) {
          color = '#FFFFFF';
        } else if (idx === passedWeeks) {
          color = state.currentWeekColor;
          rVal = (Number(radius) * 1.3).toFixed(2);
        }

        circles.push(`<circle cx="${cx}" cy="${cy}" r="${rVal}" fill="${color}"/>`);
      }
    }

    let footerSvg = '';
    if (state.showText) {
      const textBaseY = startY + gridHeight + 70;
      const statsText = `SEMAINE ${passedWeeks.toLocaleString('fr-FR')} / ${totalWeeks.toLocaleString('fr-FR')}  •  ${percentLived}% VÉCU`;

      footerSvg = `
        <text x="${width / 2}" y="${textBaseY}" text-anchor="middle" fill="#8E8E93" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="26" font-weight="600" letter-spacing="2">
          ${statsText}
        </text>
        <text x="${width / 2}" y="${textBaseY + 45}" text-anchor="middle" fill="#545458" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-size="20" font-weight="500" letter-spacing="4">
          MEMENTO MORI
        </text>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#000000"/>
        <g id="preview-grid">
          ${circles.join('')}
        </g>
        ${footerSvg}
      </svg>
    `;
  }

  // Update UI & Preview
  function update() {
    const stats = calculateStats(state.dob, state.lifespan);

    // Update stats cards
    statAge.textContent = `${stats.ageYears} ans ${stats.ageMonths > 0 ? stats.ageMonths + 'm' : ''}`;
    statPassed.textContent = stats.passedWeeks.toLocaleString('fr-FR');
    statLeft.textContent = stats.remainingWeeks.toLocaleString('fr-FR');
    statPercent.textContent = `${stats.percentLived}%`;
    progressBar.style.width = `${Math.min(100, stats.percentLived)}%`;

    // Render SVG into mockup
    wallpaperPreview.innerHTML = renderSvg(stats);

    // Construct API URL
    const baseUrl = window.location.origin;
    const colorHex = state.currentWeekColor.replace('#', '');
    const url = `${baseUrl}/api/wallpaper?dob=${state.dob}&years=${state.lifespan}&current=${colorHex}&text=${state.showText}`;
    apiUrlInput.value = url;
  }

  // Event Listeners
  dobInput.addEventListener('change', (e) => {
    state.dob = e.target.value;
    update();
  });

  lifespanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lifespanButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lifespan = parseInt(btn.dataset.years, 10);
      update();
    });
  });

  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentWeekColor = btn.dataset.color;
      update();
    });
  });

  showTextCheckbox.addEventListener('change', (e) => {
    state.showText = e.target.checked;
    update();
  });

  // Copy URL
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(apiUrlInput.value);
      const span = copyBtn.querySelector('span');
      span.textContent = 'Copié !';
      copyBtn.style.background = '#30D158';
      setTimeout(() => {
        span.textContent = 'Copier';
        copyBtn.style.background = '';
      }, 2000);
    } catch {
      apiUrlInput.select();
      document.execCommand('copy');
    }
  });

  // Download image
  downloadBtn.addEventListener('click', () => {
    const downloadUrl = apiUrlInput.value;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `notime_wallpaper_${state.dob}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Initial render
  update();
});
