const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
});

function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
}

class Particle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.alpha = 1;
        this.radius = 1 + Math.random() * 2;
        this.gravity = 0.018 + Math.random() * 0.012;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity * 30;
        this.speed *= 0.97;
        this.alpha -= 0.012 + Math.random() * 0.008;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.createParticles();
    }
    createParticles() {
        const count = 36 + Math.floor(Math.random() * 24);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2.5 + Math.random() * 2.5;
            this.particles.push(new Particle(this.x, this.y, angle, speed, this.color));
        }
    }
    update() {
        this.particles.forEach(p => p.update());
    }
    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
    isAlive() {
        return this.particles.some(p => p.alpha > 0);
    }
}

let fireworks = [];

function launchFirework() {
    // Launch from random bottom position to random height
    const x = 100 + Math.random() * (W - 200);
    const y = 150 + Math.random() * (H / 2 - 120);
    const color = randomColor();
    fireworks.push(new Firework(x, y, color));
}

function animate() {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    fireworks.forEach(fw => {
        fw.update();
        fw.draw(ctx);
    });
    fireworks = fireworks.filter(fw => fw.isAlive());
    requestAnimationFrame(animate);
}

// Launch fireworks at intervals
setInterval(launchFirework, 700);
animate();