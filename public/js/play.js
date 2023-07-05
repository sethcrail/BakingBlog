const canvas = document.getElementById('game-canvas');
const backgroundCanvas = document.getElementById('game-canvas-bgd');
const canvasRect = document.getElementById('game-wrapper').getBoundingClientRect();
const ctxBgd = backgroundCanvas.getContext('2d');
const ctx = canvas.getContext('2d');

canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

canvas.width = 360;
canvas.height = 720;
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;

const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;

const startScreenElements = document.querySelectorAll('.start-screen');
const endScreenElements = document.querySelectorAll('.end-screen');
const startBtn = document.getElementById('start-btn');
const gameOverText = document.getElementById('game-over-text');
const finalScoreText =  document.getElementById('final-score-text');

let score = 0;
let gameOver = false;

let foodArray = [];
let numberOfFood = 3;
let foodSpeedScale = 1;
const foodSpeedMinimum = 3;
const playerHeight = 60;
const playerWidth = playerHeight * 2;
let delayValue = 500;
let tickCounter = 0;

const point = new Audio("/assets/game/audio/point.mp3");

const backgroundImg = new Image();
backgroundImg.src = "/assets/game/KitchenBgd.png";
const bowl = new Image();
bowl.src = "/assets/game/Mixing_Bowl.png";
const milk = new Image();
milk.src = "/assets/game/Milk.png";
const butter = new Image();
butter.src = "/assets/game/Butter.png";
const chocolate = new Image();
chocolate.src = "/assets/game/Chocolate.png";
const flour = new Image();
flour.src = "/assets/game/Flour.png";
const egg = new Image();
egg.src = "/assets/game/Egg.png";
const knife = new Image();
knife.src = "/assets/game/Knife.png";
const rollingPin = new Image();
rollingPin.src = "/assets/game/Rolling_Pin.png";
const measuringCup = new Image();
measuringCup.src = "/assets/game/Measuring_Cup.png";

ctx.font = "3rem Crimson Text";

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
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bowl, this.x, this.y, this.width, this.height);
        ctx.imageSmoothingEnabled = true;

    }
    update() {
        this.x = mouse.x - canvasPosition.x - (this.width / 2);
    }
}

let player = new Player;

class Food {
    constructor() {
        this.size = 75;
        this.x = (this.size / 2) + Math.random() * (canvas.width - this.size);
        this.y = 0 - this.size;
        this.dy = foodSpeedMinimum + Math.random() * foodSpeedScale;
        this.angle = Math.random() * 360;
        this.spin = Math.random() < 0.5 ? -1 : 1;
        this.delay = Math.floor(Math.random() * delayValue);
        this.type = Math.floor(Math.random() * 8);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI/360 * this.spin);
        switch (this.type) {
            case 0:
                ctx.drawImage(milk, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 1:
                ctx.drawImage(butter, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 2:
                ctx.drawImage(chocolate, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 3:
                ctx.drawImage(flour, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 4:
                ctx.drawImage(egg, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 5:
                ctx.drawImage(knife, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            case 6:
                ctx.drawImage(rollingPin, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break; 
            case 7:
                ctx.drawImage(measuringCup, 0 - (this.size / 2), 0 - (this.size / 2), this.size, this.size);
                break;
            default:
                break;
        }
        ctx.restore();
    }

    reset() {
        this.y = 0 - this.size;
        this.x = (this.size / 2) + Math.random() * (canvas.width - this.size);
        this.dy = foodSpeedMinimum + Math.random() * foodSpeedScale;
        this.type = Math.floor(Math.random() * 8);
        this.delay = Math.floor(Math.random() * delayValue);
        this.spin = Math.random() < 0.5 ? -1 : 1;
    }

    move() {
        this.y += this.dy;
        this.angle++;
    }

    update() {
        if (this.y >= canvas.height + this.size / 2) {
            this.reset();

        } else if (this.y >= canvas.height - player.height) {

            if (this.x <= player.x + player.width && this.x >= player.x) {
                if (this.type == 7 || this.type == 6 || this.type == 5) {
                    gameOver = true;
                } else {
                    score++;
                    point.play();
                    this.reset();
                }
            } else {
                this.move();
            }

        } else {
            this.move();
        }


    }   
}

//Game Architecture

function startGame() {
    startScreenElements.forEach(element => {
        element.style.display = 'none';
    });
    endScreenElements.forEach(element => {
        element.style.display = 'none';
    });

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

    ctxBgd.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

}

function drawScore() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillText("Score: " + score, 10, 50);
    ctx.imageSmoothingEnabled = true;
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
    foodArray.push(new Food());
}

function speedUp() {
    foodSpeedScale = foodSpeedScale + 0.04;
    delayValue = delayValue - 50;
}

function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxBgd.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height)

    gameOverText.innerHTML = "Game Over!";
    gameOverText.style.display = 'block';
    finalScoreText.innerHTML = "Final Score: " + score;
    finalScoreText.style.display = 'block';

    startBtn.style.fontSize = "32px";
    startBtn.innerHTML = "Play Again";
    startBtn.style.display = "block";

    if (score > currentHighScore5 || scoresList.length < 5) {
        hiScorePrompt();
    } else {
        document.getElementById('knife1').style.display = 'block';
        document.getElementById('knife2').style.display = 'block';
    }
}

function hiScorePrompt() {
    gameOverText.innerHTML = "High Score!";
    gameOverText.style.fontSize = "48px"
    document.getElementById('hs-form').style.display = "block";
    document.getElementById('hs-form-score').value = score;
    document.getElementById('crown').style.display = 'block';

}
