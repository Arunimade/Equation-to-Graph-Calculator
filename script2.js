const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d');
let W, H, cx, cy, scale = 40;
let panX = 0, panY = 0;
let curA = 1, curB = 0, curC = 0;

const presets = [[1,-2,-3],[2,4,-6],[-1,0,4],[0.5,1,-2],[3,-6,3]];
let pi = 0;

function fmt(n) {
  return n.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  W = rect.width; H = 400;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cx = W / 2 + panX;
  cy = H / 2 + panY;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const step = scale;
  const gridCol = '#ede9e3';
  const axisCol = '#9a9590';
  const textCol = '#aaa';

  // Grid lines
  ctx.strokeStyle = gridCol;
  ctx.lineWidth = 0.5;
  for (let x = cx % step; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = cy % step; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = axisCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  // Tick labels
  ctx.fillStyle = textCol;
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'center';
  for (let px = cx % step; px < W; px += step) {
    const val = Math.round((px - cx) / step);
    if (val === 0) continue;
    ctx.fillText(val, px, cy + 14);
  }
  ctx.textAlign = 'right';
  for (let py = cy % step; py < H; py += step) {
    const val = Math.round((cy - py) / step);
    if (val === 0) continue;
    ctx.fillText(val, cx - 6, py + 4);
  }

  // Axis labels
  ctx.fillStyle = axisCol;
  ctx.font = '13px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('x', W - 18, cy - 8);
  ctx.fillText('y', cx + 8, 14);

  // Parabola
  const a = curA, b = curB, c = curC;
  ctx.strokeStyle = '#185FA5';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let first = true;
  for (let px = 0; px <= W; px++) {
    const x = (px - cx) / scale;
    const y = a * x * x + b * x + c;
    const py = cy - y * scale;
    if (py < -H || py > 2 * H) { first = true; continue; }
    if (first) { ctx.moveTo(px, py); first = false; }
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Vertex dot
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;
  const vpx = cx + vx * scale, vpy = cy - vy * scale;
  if (vpx >= 0 && vpx <= W && vpy >= 0 && vpy <= H) {
    ctx.fillStyle = '#185FA5';
    ctx.beginPath(); ctx.arc(vpx, vpy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0C447C';
    ctx.font = '11px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`(${fmt(vx)}, ${fmt(vy)})`, vpx + 8, vpy - 6);
  }

  // Root dots
  const disc = b * b - 4 * a * c;
  if (disc >= 0) {
    [(-b + Math.sqrt(disc)) / (2 * a), (-b - Math.sqrt(disc)) / (2 * a)].forEach(rx => {
      const rpx = cx + rx * scale;
      ctx.fillStyle = '#3B6D11';
      ctx.beginPath(); ctx.arc(rpx, cy, 4, 0, Math.PI * 2); ctx.fill();
    });
  }
}

function updateStats() {
  const a = curA, b = curB, c = curC;
  const vx = -b / (2 * a), vy = a * vx * vx + b * vx + c;
  document.getElementById('sv').textContent = `(${fmt(vx)}, ${fmt(vy)})`;
  const disc = b * b - 4 * a * c;
  if (disc > 0) {
    const r1 = fmt((-b + Math.sqrt(disc)) / (2 * a));
    const r2 = fmt((-b - Math.sqrt(disc)) / (2 * a));
    document.getElementById('sr').textContent = r1 === r2 ? r1 : `${r1},  ${r2}`;
  } else if (disc === 0) {
    document.getElementById('sr').textContent = fmt(vx);
  } else {
    document.getElementById('sr').textContent = 'No real roots';
  }
  document.getElementById('sy').textContent = fmt(c);
  document.getElementById('so').textContent = a > 0 ? '↑ upward' : '↓ downward';
}

function doPlot() {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const c = parseFloat(document.getElementById('c').value);
  if (!isFinite(a) || a === 0) { alert('a must be a nonzero number'); return; }
  curA = a; curB = b; curC = c;
  updateStats(); draw();
}

function resetView() {
  scale = 40; panX = 0; panY = 0;
  cx = W / 2; cy = H / 2;
  draw();
  document.getElementById('zl').textContent = 'Scale: 40px / unit';
}

function zoom(factor) {
  scale = Math.min(200, Math.max(8, scale * factor));
  draw();
  document.getElementById('zl').textContent = `Scale: ${Math.round(scale)}px / unit`;
}

function addPreset() {
  const [a, b, c] = presets[pi++ % presets.length];
  document.getElementById('a').value = a;
  document.getElementById('b').value = b;
  document.getElementById('c').value = c;
  doPlot();
}

// Mouse pan
let dragging = false, lastX, lastY;
canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('mouseup', () => dragging = false);
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  panX += dx; panY += dy; cx += dx; cy += dy;
  lastX = e.clientX; lastY = e.clientY;
  draw();
});

// Scroll zoom
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1.1 : 0.91);
}, { passive: false });

// Touch pan
let lt;
canvas.addEventListener('touchstart', e => { lt = e.touches[0]; }, { passive: true });
canvas.addEventListener('touchmove', e => {
  if (!lt) return;
  const t = e.touches[0];
  panX += t.clientX - lt.clientX; panY += t.clientY - lt.clientY;
  cx += t.clientX - lt.clientX; cy += t.clientY - lt.clientY;
  lt = t; draw();
}, { passive: true });

new ResizeObserver(resize).observe(canvas);
resize();
updateStats();
