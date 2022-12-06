const dark = '#0D0D0D';
const gold = '#D9A036';
let vertices = [];
let started = false;
let dot;

let count = 100000;
let initDot = false;
let numbers = false;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);

function drawCircle(x, y, r = 0.5) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke()
}

function drawTriangle(ctx, side) {
    const h = side * (Math.sqrt(3)/2);
    vertices = [[0, -h / 2], [-side / 2, h / 2], [side / 2, h / 2]];

    ctx.strokeStyle = gold;
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    ctx.lineTo(...vertices[1]);
    ctx.lineTo(...vertices[2]);
    ctx.lineTo(...vertices[0]);
    ctx.stroke();
    ctx.closePath();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fractalize() {
    for (let i = 0; i <= count; i++) {
        setTimeout(() => {
            const [vx, vy] = vertices[getRandomInt(0, 2)];
            const [dx, dy] = dot;
            const dotInBetween = [(vx + dx) / 2, (vy + dy) / 2];
            dot = dotInBetween;
            ctx.font = "10px Arial";
            ctx.fillStyle = gold;
            drawCircle(...dotInBetween);
            if (numbers) {
                ctx.fillText(`${i}`, dot[0] + 5, dot[1] - 5);
            }
        }, 100);
    }
}

function init() {
    resizeCanvas();

    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const [cx, cy] = [canvas.width / 2, canvas.height / 2];
    ctx.translate(cx, cy);

    drawTriangle(ctx, 600, cx, cy)

    canvas.addEventListener('click', (event) => {
        if (started) {
            return;
        }

        if (!dot) {
            if (initDot) {
                const { clientX: x, clientY: y } = event;
                ctx.fillStyle = '000000';
                dot = [x - cx, y - cy];
                drawCircle(...dot, 4);
                return;
            } else {
                dot = vertices[0];
            }
        }

        started = true;
        fractalize();
    });
}

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        init();
    }
});
