const canvas = document.getElementById('game-canvas');
const canvasRect = document.getElementById('game-wrapper').getBoundingClientRect();
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 720;

const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;

//get this from DB
let hiScore5 = 20;

let score = 0;
let gameOver = false;

let foodArray = [];
let numberOfFood = 3;
let foodSpeedScale = 1;
const foodSpeedMinimum = 2;
const playerHeight = 50;
const playerWidth = 100;
let delayValue = 500;
let tickCounter = 0;

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

let player = new Player;

class Food {
    constructor() {
        this.size = 50;
        this.x = (this.size / 2) + Math.random() * (canvas.width - this.size);
        this.y = 0 - this.size;
        this.dy = foodSpeedMinimum + Math.random() * foodSpeedScale;
        this.angle = Math.random() * 360;
        this.spin = Math.random() < 0.5 ? -1 : 1;
        this.delay = Math.floor(Math.random() * delayValue);
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
            this.delay = Math.floor(Math.random() * delayValue);

        } else {
            this.y += this.dy;
            this.angle++;
        }

    }
}

//Game Architecture

function startGame() {
    document.getElementById("start-btn").style.display = "none";
    init();
    animate();
}

function init() {
    resetVariables();
    
    for (let i = 0; i < numberOfFood; i++) {
        foodArray.push(new Food());
    }
    foodArray[0].type = 0;
    foodArray[0].delay = 50;

    foodArray[1].type = 0;
    foodArray[1].delay = 200;

    foodArray[2].type = 0;
    foodArray[2].delay = 400;

    console.log(foodArray);
}

function drawScore() {
    ctx.fillText("Score: " + score, 10, 50);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < foodArray.length; i++) {
        foodArray[i].draw();
        if (foodArray[i].delay > 0) {
            foodArray[i].delay--;
        } else {
            foodArray[i].update();
        }
    }

    player.draw();

    if (mouse.x > (canvasPosition.x + player.width / 2) && mouse.x < (canvasRect.right - 0.5 * player.width)) {
        player.update();
    }

    drawScore();

    if (tickCounter % 2000 == 0) {
        levelUp();
    }
    if (tickCounter % 1000 == 0) {
        speedUp();
    }
    tickCounter++;
    
    if (!gameOver) {
        requestAnimationFrame(animate);
    } else {
        endGame();
    }

}

function resetVariables() {
    foodArray = [];
    numberOfFood = 3;
    foodSpeedScale = 1;
    delayValue = 500;
    tickCounter = 0;
    score = 0;
    gameOver = false;
}

function levelUp() {
    // numberOfFood++;
    foodArray.push(new Food());
}

function speedUp() {
    foodSpeedScale = foodSpeedScale + 0.04;
    delayValue = delayValue - 50;
}


function endGame() {
    if (score > hiScore5) {
        hiScorePrompt();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("Game Over", canvasCenterX - 50, canvasCenterY);
        ctx.fillText("Final Score: " + score, canvasCenterX - 50, canvasCenterY + 10);
    
    }

}

function hiScorePrompt() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Hi-Score Achieved!", canvasCenterX - 50, canvasCenterY);
    ctx.fillText("Final Score: " + score, canvasCenterX - 50, canvasCenterY + 10);


}
