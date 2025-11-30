const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('equationForm');
const info = document.getElementById('info');

const W = canvas.width;
const H = canvas.height;
const centerX = W / 2;
const centerY = H / 2;

function drawAxes() {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(W, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, H);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui';
    ctx.fillText('x', W - 20, centerY + 20);
    ctx.fillText('y', centerX + 10, 15);
}

function plot(a, b, c) {
    ctx.clearRect(0, 0, W, H);
    
    // Grid
    ctx.strokeStyle = '#f1f5f9';
    for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke(); }

    drawAxes();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let px = -centerX; px <= centerX; px += 1) {
        const x = px / 30;
        const y = a * x * x + b * x + c;
        const py = centerY - y * 30;

        if (Math.abs(y) > 100) continue;

        if (first) { ctx.moveTo(centerX + px, py); first = false; }
        else { ctx.lineTo(centerX + px, py); }
    }
    ctx.stroke();

    // Info
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX ** 2 + b * vertexX + c;
    const d = b * b - 4 * a * c;

    const roots = d > 0 
        ? `Roots: ${((-b + Math.sqrt(d))/(2*a)).toFixed(2)}, ${((-b - Math.sqrt(d))/(2*a)).toFixed(2)}`
        : d === 0 ? `Root: ${vertexX.toFixed(2)}` : "No real roots";

    info.innerHTML = `
        y = ${a}x² + ${b}x + ${c}<br>
        Vertex: (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})<br>
        ${roots}<br>
        ${a > 0 ? "Opens upward" : "Opens downward"}
    `;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const a = +document.getElementById('a').value;
    const b = +document.getElementById('b').value;
    const c = +document.getElementById('c').value;

    if (a === 0) return alert("a cannot be 0");
    plot(a, b, c);
});

// Plot default on load
plot(1, 0, 0);
