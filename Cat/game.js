const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let ballRadius = 20; // Adjusted radius for better image scaling
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const giantWidth = 150;
const giantHeight = 20;
let giantX = (canvas.width - giantWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let gameOver = false; // Flag to track if the game is over

// Load the custom image for the ball
const ballImage = new Image();
ballImage.src = "cat.png"; // Use your image file name here

// Set canvas dimensions to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9; // 90% of the screen width
    canvas.height = window.innerHeight * 0.8; // 80% of the screen height
    giantX = (canvas.width - giantWidth) / 2; // Recenter the paddle
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Call the function initially to set the size

// Event listeners for keyboard controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Handle touch events
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
    e.preventDefault(); // Prevent scrolling
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX > 0 && touchX < canvas.width) {
        giantX = touchX - giantWidth / 2; // Move the paddle to the touch position
    }
}

// Draw the ball using the custom image, 2x bigger
function drawBall() {
    ctx.drawImage(ballImage, x - ballRadius * 2, y - ballRadius * 2, ballRadius * 4, ballRadius * 4);
}

// Draw the giant (paddle)
function drawGiant() {
    ctx.beginPath();
    ctx.rect(giantX, canvas.height - giantHeight, giantWidth, giantHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

// Update game status
function updateScore() {
    document.getElementById("gameStatus").innerText = `Score: ${score}`;
}

// Main game loop
function draw() {
    if (gameOver) return; // Stop the game loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawGiant();

    // Ball collision with walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > giantX && x < giantX + giantWidth) {
            dy = -dy;
            score++;
            updateScore();
        } else {
            // Game over
            gameOver = true;
            alert("GAME OVER! Your score: " + score);
            document.location.reload();
        }
    }

    // Update ball position
    x += dx;
    y += dy;

    // Move giant (paddle)
    if (rightPressed && giantX < canvas.width - giantWidth) {
        giantX += 7;
    } else if (leftPressed && giantX > 0) {
        giantX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
