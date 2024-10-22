const canva = document.getElementById('gameSnake');
const ctx = canva.getContext('2d'); // Corrected

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }]; // Fixed initialization
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};
let direction = 'RIGHT';
let score = 0;
let game; // Declare game variable

// Control the snake using keyboard
document.addEventListener('keydown', changeDirection);

// Control the snake using buttons
document.getElementById('left').addEventListener('click', () => changeDirection({ keyCode: 37 }));
document.getElementById('up').addEventListener('click', () => changeDirection({ keyCode: 38 }));
document.getElementById('down').addEventListener('click', () => changeDirection({ keyCode: 40 }));
document.getElementById('right').addEventListener('click', () => changeDirection({ keyCode: 39 }));

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#fff' : 'rgb(159, 55, 55)'; // Change the snake color
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Draw the food
function drawFood() {
    ctx.fillStyle = 'rgb(159, 55, 55)';
    ctx.fillRect(food.x, food.y, box, box);
}

// Update game state
function updateGame() {
    // Get the current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move the snake in the current direction
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Check if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }; // Re-generate food at random position
    } else {
        snake.pop(); // Remove the tail if no food eaten
    }

    // Add new head to the snake
    let newHead = { x: snakeX, y: snakeY };

    // Check for collision with walls or itself
    if (snakeX < 0 || snakeY < 0 || snakeX >= 20 * box || snakeY >= 20 * box || collision(newHead, snake)) {
        clearInterval(game); // End the game
    // SweetAlert for Game Over
    swal({
        title: "Game Over!",
        text: "Your score was: " + score,
        icon: "error",
        buttons: {
            restart: {
                text: "Restart",
                value: "restart",
            },
            cancel: {
                text: "Cancel",
                value: "cancel",
                visible: true,
                className: "cancel",
                closeModal: true,
            },
        },
    }).then((value) => {
        switch (value) {
            case "restart":
                restart();
                break;
            default:
                // Do nothing, game remains over
                break;
        }
    });
}

    snake.unshift(newHead); // Add new head at the beginning of the array
}

// Collision detection
function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canva.width, canva.height); // Clear the canvas
    drawSnake();
    drawFood();
    updateGame();
    ctx.fillStyle = 'rgb(159, 55, 55)';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('Score: ' + score, box, box); // Display the score
}

// Start the game loop
function startGame() {
    game = setInterval(draw, 300); // Game loop speed
}

// Restart the game
document.getElementById('restart').addEventListener('click', restart);
function restart() {
    // Reset the snake's position, length, and direction
    snake = [{ x: 9 * box, y: 10 * box }]; // Reset the snake to the starting position
    direction = 'RIGHT'; // Reset the direction
    score = 0; // Reset the score

    // Reposition the food
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
    };

    // If the game was stopped, restart the game loop
    clearInterval(game); // Clear the existing interval
    startGame(); // Restart the game loop
}

// Start the game for the first time
startGame();
