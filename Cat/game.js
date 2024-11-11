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
let paused = false; // Flag to track if the game is paused

let isMouseDown = false; // To track if mouse is clicked
let mouseX = 0; // To track mouse position

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

// Event listeners for mouse controls
canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);

// Event listeners for keyboard controls (if you want to keep them)
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Event listener for the pause button
document.getElementById("pauseButton").addEventListener("click", togglePause, false);

function mouseDownHandler(e) {
    if (e.button === 0) { // Left mouse button
        isMouseDown = true;
        mouseX = e.clientX - canvas.getBoundingClientRect().left;
    }
}

function mouseMoveHandler(e) {
    if (isMouseDown) {
        mouseX = e.clientX - canvas.getBoundingClientRect().left;
        if (mouseX > 0 && mouseX < canvas.width) {
            giantX = mouseX - giantWidth / 2; // Move the paddle to the mouse position
        }
    }
}

function mouseUpHandler() {
    isMouseDown = false;
}

// Handle touch events for mobile controls (as you previously had)
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

// Toggle the pause state
function togglePause() {
    paused = !paused; // Toggle between paused and resumed
    if (paused) {
        document.getElementById("pauseButton").textContent = "Resume"; // Change button text to "Resume"
    } else {
        document.getElementById("pauseButton").textContent = "Pause"; // Change button text back to "Pause"
        draw(); // Resume the game loop
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
    if (gameOver || paused) return; // Stop the game loop if the game is over or paused

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

    // Move giant (paddle) - keyboard controls
    if (rightPressed && giantX < canvas.width - giantWidth) {
        giantX += 7;
    } else if (leftPressed && giantX > 0) {
        giantX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
