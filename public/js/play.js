const canvas = document.getElementById('game-canvas');
const canvasRect = document.getElementById('game-wrapper').getBoundingClientRect();
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 720;

let foodArray = [];
const numberOfFood = 2;
let foodSpeedScale = 6;
const foodSpeedMinimum = 2;
const playerHeight = 50;
const playerWidth = 100;

let score = 0;

const canvasPosition = {
    x: canvasRect.x - window.scrollX,
    y: canvasRect.y - window.scrollY
}

const mouse = {
    x: null,
    y: null
}

onmousemove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
}

ctx.font = "48px Crimson-Text serif";
function drawScore() {
    ctx.fillText("Score: " + score, 10, 50);
}

class Player {
    constructor() {
        this.width = playerWidth;
        this.height = playerHeight;
        this.x = (0.5 * canvas.width) - (0.5 * this.width);
        this.y = canvas.height - this.height;
    }
    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x = mouse.x - canvasPosition.x - (0.5 * this.width);
    }
}

class Food {
    constructor() {
        this.size = 50;
        this.x = (0.5 * this.size) + Math.random() * (canvas.width - this.size);
        this.y = 0 - this.size;
        this.speed = foodSpeedMinimum + Math.random() * foodSpeedScale;
        this.angle = Math.random() * 360;
        this.spin = Math.random() < 0.5 ? -1 : 1;
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI/360 * this.spin);
        ctx.fillRect(0 - this.size/2, 0 - this.size/2, this.size, this.size);
        ctx.restore();
    }
    update() {
        this.angle++;
        if (this.y >= canvas.height){
            if (this.x <= player.x + player.width + 5 && this.x >= player.x - 5) {
                score++;
                console.log(score);
            }
            this.y = 0 - this.size;
            this.x = (0.5 * this.size) + Math.random() * (canvas.width - this.size);
        } else {
            this.y += this.speed;
        }

    }
}

function init() {
    for (let i = 0; i < numberOfFood; i++) {
        foodArray.push(new Food());
    }
}

let player = new Player;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < foodArray.length; i++) {
        foodArray[i].draw();
        foodArray[i].update();
    }

    player.draw();
    if (mouse.x > (canvasPosition.x + 0.5 * player.width) && mouse.x < (canvasRect.right - 0.5 * player.width)) {
        player.update();
    }
    drawScore();
    requestAnimationFrame(animate);
}

function startGame() {
    init();
    animate();
    document.getElementById('start-btn').style.display = "none";
}
