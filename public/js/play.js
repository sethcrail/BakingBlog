const canvas = document.getElementById('game-canvas');
const canvasRect = document.getElementById('game-wrapper').getBoundingClientRect();
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 720;

const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;

let score = 0;
let gameOver = false;

let foodArray = [];
const numberOfFood = 4;
let foodSpeedScale = 2;
const foodSpeedMinimum = 2;
const playerHeight = 50;
const playerWidth = 100;

ctx.font = "48px Crimson-Text serif";

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

function drawScore() {
    ctx.fillText("Score: " + score, 10, 50);
}

//Game Entities

class Player {
    constructor() {
        this.width = playerWidth;
        this.height = playerHeight;
        this.x = canvasCenterX - this.width;
        this.y = canvas.height - this.height;
    }
    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x = mouse.x - canvasPosition.x - (this.width / 2);
    }
}

class Food {
    constructor() {
        this.size = 50;
        this.x = (this.size / 2) + Math.random() * (canvas.width - this.size);
        this.y = 0 - this.size;
        this.dy = foodSpeedMinimum + Math.random() * foodSpeedScale;
        this.angle = Math.random() * 360;
        this.spin = Math.random() < 0.5 ? -1 : 1;
        this.type = Math.floor(Math.random() * 3);
    }

    draw() {
        ctx.save();
        if (this.type == 0 || this.type == 1) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI/360 * this.spin);
        ctx.fillRect(0 - this.size/2, 0 - this.size/2, this.size, this.size);
        ctx.restore();
    }
    update() {
        if (this.y >= canvas.height){

            if (this.x <= player.x + player.width && this.x >= player.x) {
                    if (this.type == 0 || this.type == 1) {
                        score++;
                    } else {
                        gameOver = true;
                    }

            }

            this.y = 0 - this.size;
            this.x = (this.size / 2) + Math.random() * (canvas.width - this.size);
            this.dy = foodSpeedMinimum + Math.random() * foodSpeedScale;
            this.type = Math.floor(Math.random() * 3);

        } else {
            this.y += this.dy;
            this.angle++;
        }

    }
}

//Game Architecture

function init() {
    for (let i = 0; i < numberOfFood; i++) {
        foodArray.push(new Food());
    }
    let score = 0;
    let gameOver = false;
}

let player = new Player;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < foodArray.length; i++) {
        foodArray[i].draw();
        foodArray[i].update();
    }

    player.draw();

    if (mouse.x > (canvasPosition.x + player.width / 2) && mouse.x < (canvasRect.right - 0.5 * player.width)) {
        player.update();
    }

    drawScore();
    
    if (!gameOver) {
        requestAnimationFrame(animate);
    } else {
        endGame();
    }

}

function startGame() {
    document.getElementById("start-btn").style.display = "none";
    init();
    animate();
}

function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Game Over", canvasCenterX, canvasCenterY);
    ctx.fillText("Final Score: " + score, canvasCenterX, canvasCenterY + 10);

}

function hiScorePrompt() {

}
