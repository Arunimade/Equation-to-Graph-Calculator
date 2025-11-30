const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('equationForm');
const infoDiv = document.getElementById('info');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDING = 50;

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= WIDTH; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= HEIGHT; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('X', WIDTH - 20, HEIGHT/2 + 15);
    ctx.fillText('Y', WIDTH/2 + 10, 15);
}

function plot(a, b, c) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawGrid();

    const scaleX = 30;  // pixels per unit on X
    const scaleY = 30;  // pixels per unit on Y
    const originX = WIDTH / 2;
    const originY = HEIGHT / 2;

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let px = -originX; px <= originX; px += 1) {
        const x = px / scaleX;
        const y = a * x * x + b * x + c;

        const canvasY = originY - y * scaleY;

        if (Math.abs(y) > 100) continue; // Prevent extreme values

        if (first) {
            ctx.moveTo(originX + px, canvasY);
            first = false;
        } else {
            ctx.lineTo(originX + px, canvasY);
        }
    }
    ctx.stroke();

    // Show vertex and roots info
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    const discriminant = b * b - 4 * a * c;
    let rootsText = "";

    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        rootsText = `Roots: x = ${root1.toFixed(2)}, x = ${root2.toFixed(2)}`;
    } else if (discriminant === 0) {
        rootsText = `Root: x = ${vertexX.toFixed(2)} (double root)`;
    } else {
        rootsText = "No real roots";
    }

    infoDiv.innerHTML = `
        <strong>Equation:</strong> y = ${a}x² + ${b}x + ${c}<br>
        <strong>Vertex:</strong> (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})<br>
        <strong>Discriminant:</strong> ${discriminant.toFixed(2)} → ${rootsText}<br>
        <strong>Direction:</strong> ${a > 0 ? "Opens upward" : "Opens downward"}
    `;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);

    if (a === 0) {
        alert("Coefficient 'a' cannot be zero!");
        return;
    }

    plot(a, b, c);
});

// Plot default parabola on load
window.onload = () => plot(1, 0, 0);
