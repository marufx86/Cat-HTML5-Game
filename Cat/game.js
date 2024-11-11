const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScoreElement = document.getElementById("finalScore");
const retryButton = document.getElementById("retryButton");
const pauseButton = document.getElementById("pauseButton");

let score = 0;
let ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const giantWidth = 150;
const giantHeight = 20;
let giantX = (canvas.width - giantWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let gameOver = false;
let paused = false;

let isMouseDown = false;
let mouseX = 0;

const ballImage = new Image();
ballImage.src = "cat.png";

const cryImage = new Image();
cryImage.src = "catCry.png";

const dieImage = new Image();
dieImage.src = "dieCat.png";

let currentBallImage = ballImage;

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    giantX = (canvas.width - giantWidth) / 2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
pauseButton.addEventListener("click", togglePause, false);

retryButton.addEventListener("click", () => {
    document.location.reload();
});

function mouseDownHandler(e) {
    if (e.button === 0) {
        isMouseDown = true;
        mouseX = e.clientX - canvas.getBoundingClientRect().left;
    }
}

function mouseMoveHandler(e) {
    if (isMouseDown) {
        mouseX = e.clientX - canvas.getBoundingClientRect().left;
        if (mouseX > 0 && mouseX < canvas.width) {
            giantX = mouseX - giantWidth / 2;
        }
    }
}

function mouseUpHandler() {
    isMouseDown = false;
}

canvas.addEventListener("touchstart", handleTouch, false);
canvas.addEventListener("touchmove", handleTouch, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX > 0 && touchX < canvas.width) {
        giantX = touchX - giantWidth / 2;
    }
}

function togglePause() {
    paused = !paused;
    pauseButton.textContent = paused ? "Resume" : "Pause";
    if (!paused) draw();
}

function drawBall() {
    ctx.drawImage(currentBallImage, x - ballRadius * 2, y - ballRadius * 2, ballRadius * 4, ballRadius * 4);
}

function drawGiant() {
    ctx.beginPath();
    ctx.rect(giantX, canvas.height - giantHeight, giantWidth, giantHeight);
    ctx.fillStyle = "#ff4081";
    ctx.fill();
    ctx.closePath();
}

function updateScore() {
    document.getElementById("gameStatus").innerText = `Score: ${score}`;
}

function displayGameOver() {
    gameOver = true;
    currentBallImage = dieImage;
    finalScoreElement.textContent = score;
    gameOverMessage.style.display = "block";
}

function draw() {
    if (gameOver || paused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawGiant();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        currentBallImage = cryImage;
        setTimeout(() => {
            currentBallImage = ballImage;
        }, 200);
    }

    if (y + dy < ballRadius) {
        dy = -dy;
        currentBallImage = cryImage;
        setTimeout(() => {
            currentBallImage = ballImage;
        }, 200);
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > giantX && x < giantX + giantWidth) {
            dy = -dy;
            score++;
            updateScore();
        } else {
            displayGameOver();
        }
    }

    x += dx;
    y += dy;

    if (rightPressed && giantX < canvas.width - giantWidth) {
        giantX += 7;
    } else if (leftPressed && giantX > 0) {
        giantX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
