'use strict';

var canvas, context, squares, generation, WIDTH, HEIGHT, SQUARE_COUNT_X, SQUARE_COUNT_Y;
var SQUARE_SIZE = 25;
var PADDING = 0;
var ANIMATION = true;
var colors = ['#F3D8C7', '#EFE5DC', '#0F5257', '#0B3142']; // experimenting

function initCanvas() {
    canvas = document.getElementById('grid');

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    if (!ANIMATION) {
        canvas.addEventListener('click', click, false);
    }

    context = canvas.getContext('2d');

    SQUARE_COUNT_X = Math.ceil(WIDTH / (SQUARE_SIZE + PADDING));
    SQUARE_COUNT_Y = Math.ceil(HEIGHT / (SQUARE_SIZE + PADDING));

    initGrid();
    drawBoard();

    generation = 0;

    if (ANIMATION) {
        animate();
    }
}

function initGrid() {
    squares = [];

    for (var i = 0; i < SQUARE_COUNT_X * SQUARE_COUNT_Y; i++) {
        var alive = Math.random() < 0.5;
        squares.push(new Square(alive));
    }
}

function Square(alive) {
    this.alive = alive;
}

function drawBoard() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    var i = 0;

    for (var y = 0; y < HEIGHT; y += SQUARE_SIZE + PADDING) {
        for (var x = 0; x < WIDTH; x += SQUARE_SIZE + PADDING) {
            if (squares[i++].alive) {
                context.fillStyle = colors[2];
                context.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
            } else {
                context.fillStyle = colors[3];
                context.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

function tick() {
    var nextGeneration = [];
    var isNextGenerationDifferent = false;

    for (var i = 0; i < SQUARE_COUNT_X * SQUARE_COUNT_Y; i++) {
        var liveNeighbors = getLiveNeighborsCount(i);

        if (squares[i].alive) {
            // any live cell with < 2 neighbors dies
            // any live cell with 2-3 neighbors lives on
            // any live cell with > 3 neighbors dies
            if (liveNeighbors < 2 || liveNeighbors > 3) {
                nextGeneration.push(new Square(false));
                isNextGenerationDifferent = true;
            } else {
                nextGeneration.push(new Square(true));
            }
        } else {
            // any dead cell with exactly 3 live neighbors becomes a live cell
            if (liveNeighbors === 3) {
                nextGeneration.push(new Square(true));
                isNextGenerationDifferent = true;
            } else {
                nextGeneration.push(new Square(false));
            }
        }
    }

    squares = nextGeneration;

    return isNextGenerationDifferent;
}

function getLiveNeighborsCount(index) {
    var neighborIndices;

    if (index % SQUARE_COUNT_X === 0) {
        neighborIndices = [index + 1,
            index - SQUARE_COUNT_X, (index - SQUARE_COUNT_X) + 1,
            index + SQUARE_COUNT_X, (index + SQUARE_COUNT_X) + 1
        ];
    } else if ((index + 1) % SQUARE_COUNT_X === 0) {
        neighborIndices = [index - 1,
            index - SQUARE_COUNT_X, (index - SQUARE_COUNT_X) - 1,
            index + SQUARE_COUNT_X, (index + SQUARE_COUNT_X) - 1
        ];
    } else {
        neighborIndices = [index - 1, index + 1,
            index - SQUARE_COUNT_X, (index - SQUARE_COUNT_X) - 1, (index - SQUARE_COUNT_X) + 1,
            index + SQUARE_COUNT_X, (index + SQUARE_COUNT_X) - 1, (index + SQUARE_COUNT_X) + 1
        ];
    }

    var count = 0;

    neighborIndices.forEach(function(index) {
        if (index > 0 && index < SQUARE_COUNT_X * SQUARE_COUNT_Y) {
            if (squares[index].alive) {
                count++;
            }
        }
    });

    return count;
}

function animate() {
    setTimeout(function() {
        if (tick()) {
            drawBoard();
            requestAnimationFrame(animate);
        }
    }, 1000);
}

function click() {
    tick();
    drawBoard();
}

window.onload = initCanvas;