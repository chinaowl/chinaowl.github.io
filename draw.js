'use strict';

var canvas, context, WIDTH, HEIGHT;
var BUFFER = 20;
var RADIUS = 3;

function initCanvas() {
    canvas = document.getElementById("canvas");

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.addEventListener('click', drawCircle, false);

    context = canvas.getContext("2d");

    for (var i = 0; i < 10; i++) {
    	drawCircle();
    }
}

function drawCircle(event) {
	var x, y;

	if (event) {
		x = event.pageX;
		y = event.pageY;
	} else {
		x = Math.floor(Math.random() * (WIDTH - 2 * BUFFER)) + BUFFER;
		y = Math.floor(Math.random() * (HEIGHT - 2 * BUFFER)) + BUFFER;
	}

    context.beginPath();
    context.arc(x, y, RADIUS, 0, Math.PI * 2, true);
    context.closePath();

    context.fillStyle = '#ffffff';
    context.fill();
}

window.onload = initCanvas;