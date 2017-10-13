import $ from 'jquery';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var cols = 100;
var rows = 100;
var cells = rows * cols;
var size = 25;
var gW = cols * size;
var gH = rows * size;

var gX = 0,
    gY = 0,
    pX = 0,
    pY = 0,
    gScale = 1,
    speed = 2;

var isDown = false;

ctx.strokeStyle = "#000000";
ctx.lineWidth = 1;
ctx.font = "14px sans-serif";

var grid = [];
for (var i = 0; i < cells; ++i) {
    if (Math.random() < 0.5) {
        grid.push("#FF8ED6");
    } else {
        grid.push("#8ED6FF");
    }
}

drawGrid(0, 0);

$('#canvas').mousedown(function (e) {
    isDown = true;
    pX = e.pageX;
    pY = e.pageY;
}).mouseup(function (e) {
    isDown = false;
}).mouseout(function (e) {
    isDown = false;
}).mousemove(function (e) {
    if (isDown) {
        gX += -(pX - e.pageX) * speed;
        gY += -(pY - e.pageY) * speed;
        pX = e.pageX;
        pY = e.pageY;
        if (gX > 0) gX = 0;
        if (gX < canvas.width - gW * gScale) gX = canvas.width - gW * gScale;
        if (gY > 0) gY = 0;
        if (gY < canvas.height - gH * gScale) gY = canvas.height - gH * gScale;

        drawGrid();
    }
});

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(gX, gY);
    ctx.scale(gScale, gScale);


    //for (var i = 0; i < cols; ++i) {
    //    for (var j = 0; j < rows; ++j) {
    //        ctx.fillStyle = grid[i * rows + j];
    //        ctx.fillRect(i * size, j * size, size, size);
    //        ctx.strokeRect(i * size, j * size, size, size);
    //    }
    //}

	    ctx.globalAlpha = 1;
	    ctx.strokeStyle = "#1e1e1e";
	    ctx.lineWidth = 1;
    	ctx.beginPath();
    	var x = 0;
    	var y = 0;
      var z = 0;
    	var counter = 0;

			for(var i = 0; i < Math.round(gW/size); i++){

				var z = counter;
				while(x <= size*Math.round(gH/size)){

					if(z%2 == 0){
						ctx.moveTo( x, y+size );
						ctx.lineTo( x+size, y );
					}
          else{
            ctx.moveTo(x,y);
            ctx.lineTo(x+size, y+size);
          }

          x += size;
          z += 1;


				}

			x = 0;
			y = y + size;
			counter += 1;

	}
        ctx.fill();
      ctx.stroke();

  ctx.restore();

}

/*
 * Mousewheel
 */
function handle(delta) {
    gScale += delta * 0.01;
    if (gScale < 1) gScale = 1;
    drawGrid();
}

function wheel(event) {
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    if (delta) {
        handle(delta);
    }
    event.preventDefault();
    event.returnValue = false;
}

if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', wheel, false);
}
window.onmousewheel = document.onmousewheel = wheel;
