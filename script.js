const DARK_GREY = '#0D0D0D';
const GOLD = '#D9A036';
const downTriangles = [];
const TIMING = 1;
const animate = true;
let depth = 8;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);

function drawTriangle(ctx, vertices, fill, showCoords) {
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    ctx.lineTo(...vertices[1]);
    ctx.lineTo(...vertices[2]);
    ctx.lineTo(...vertices[0]);
    ctx.closePath();

    if (fill) {
        ctx.fill();
    }

    if (showCoords) {
        vertices.forEach(([x, y]) => {

            ctx.fillStyle = "red";
            ctx.fillText(`${x}:${y}`, x + 5, y - 5);
        });
    }
}

function getDotInBetween([vx1, vy1], [vx2, vy2]) {
    return [(vx1 + vx2) / 2, (vy1 + vy2) / 2];
}

function getDownTriangle([v1, v2, v3]) {
    return [
        getDotInBetween(v1, v2),
        getDotInBetween(v2, v3),
        getDotInBetween(v1, v3),
    ];
}

function getUpTriangles([v1, v2, v3], [iv1, iv2, iv3]) {
    return [
        [v1, iv3, iv1],
        [v2, iv1, iv2],
        [v3, iv3, iv2]
    ];
}

function drawInitialTriangle(ctx, side) {
    ctx.fillStyle = GOLD;
    const [cx, cy] = [canvas.width / 2, canvas.height / 2];

    const h = 600 * (Math.sqrt(3)/2);
    let vertices = [[0, (-h / 2)], [-side / 2, h / 2], [side / 2, h / 2]];
    vertices = vertices.map(([x, y]) => [x + cx, y + cy]);

    drawTriangle(ctx, vertices, true);
    return vertices;
}

function fractalize2(initialUpTriangle) {
    const upTriangles = [[initialUpTriangle]];

    while (depth) {
        const lastLevelTriangles = upTriangles[upTriangles.length - 1];
        const level = [];
        lastLevelTriangles.forEach(([v1, v2, v3]) => {
            const downTriangle = getDownTriangle([v1, v2, v3]);
            downTriangles.push(downTriangle);
            const newUpTriangles = getUpTriangles([v1, v2, v3], downTriangle);
            level.push(...newUpTriangles);
        });
        upTriangles.push(level);
        depth--;
    }
}

function drawTriangles() {
    if (!downTriangles.length) {
        return;
    }
    const downTriangle = downTriangles.shift();
    ctx.strokeStyle = DARK_GREY;
    ctx.fillStyle = DARK_GREY;

    const draw = () => {
        drawTriangle(ctx, downTriangle, true);
        drawTriangles();
    }

    if (animate) {
        setTimeout(draw, TIMING);
    } else {
        draw();
    }
}

function init() {
    resizeCanvas();

    ctx.fillStyle = DARK_GREY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const initialTriangleVertices = drawInitialTriangle(ctx, 600);

    fractalize2(initialTriangleVertices);
    drawTriangles();
}

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        init();
    }
});
