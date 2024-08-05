document.getElementById('equationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    plotGraph(a, b, c);
});

function plotGraph(a, b, c) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(250, 500);
    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Plot the line ax + by + c = 0
    ctx.beginPath();
    const x1 = -250;
    const y1 = (-a * x1 - c) / b;
    const x2 = 250;
    const y2 = (-a * x2 - c) / b;
    ctx.moveTo(250 + x1, 250 - y1);
    ctx.lineTo(250 + x2, 250 - y2);
    ctx.strokeStyle = '#ff0075';
    ctx.stroke();
}
