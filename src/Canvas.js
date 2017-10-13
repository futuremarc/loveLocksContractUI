import $ from 'jquery';
import React, { Component } from 'react';
import Portal from 'react-minimalist-portal';

let cols = 100;
let rows = 100;
let cells = rows * cols;
let size = 25;
let gW = cols * size;
let gH = rows * size;
let canvas, ctx;

let gX = 0,
    gY = 0,
    pX = 0,
    pY = 0,
    gScale = 1,
    speed = 2;

let isDown = false;
let isDragging = false;
let dragTimeout = null;


let grid = [];
for (let i = 0; i < cells; ++i) {
    if (Math.random() < 0.5) {
        grid.push("#FF8ED6");
    } else {
        grid.push("#8ED6FF");
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(gX, gY);
    ctx.scale(gScale, gScale);


    // for (let i = 0; i < cols; ++i) {
    //
    //      for (let j = 0; j < rows; ++j) {
    //          ctx.fillStyle = grid[i * rows + j];
    //          ctx.fillRect(i * size, j * size, size, size);
    //          ctx.strokeRect(i * size, j * size, size, size);
    //          //ctx.fillText("box " + j + ", " + i, size, size);
    //      }
    //  }

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#1e1e1e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      let x = 0;
      let y = 0;
      let z = 0;
      let counter = 0;

      for(let i = 0; i < Math.round(gW/size); i++){

        let z = counter;
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


function handle(delta) {
    gScale += delta * 0.01;
    if (gScale < 1) gScale = 1;
    drawGrid();
}

function wheel(event) {
    let delta = 0;
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


class Canvas extends Component {

  constructor(props) {
    super(props)
    this.state = {};
    this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
    this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
    this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
    this.onCanvasMouseOut = this.onCanvasMouseOut.bind(this);

  }


  onCanvasMouseDown(e){
    isDown = true;
    pX = e.pageX;
    pY = e.pageY;
    isDragging = false;
    let dragTimeout = setTimeout(()=>{
      isDragging = true;
    },100)
  }

  onCanvasMouseUp(e){
    const {openForm} = this.props;
    isDown = false;
    clearTimeout(dragTimeout);
    if (!isDragging){
      const xPos = Math.round((e.nativeEvent.offsetX/size + (Math.abs(gX)/size)) / gScale);
      const yPos = Math.round((e.nativeEvent.offsetY/size + (Math.abs(gY)/size)) / gScale);
      console.log('new lock',xPos,yPos);
      openForm(xPos,yPos);
    }
    isDragging = false;

  }

  onCanvasMouseMove(e){
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
  }

  onCanvasMouseOut(e){
    isDown = false;
  }

  componentWillMount(){


  }

  componentDidMount(){


    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.font = "14px sans-serif";

    drawGrid(0, 0);

    window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;




  }
  render(){

    return(
      <Portal>
        <div key="overlay" className="modal-overlay">
          <div className="modal">
            <canvas onMouseDown={this.onCanvasMouseDown} onMouseOut={this.onCanvasMouseOut} onMouseMove={this.onCanvasMouseMove} onMouseUp={this.onCanvasMouseUp} id="canvas" width="600" height="400"></canvas>
          </div>
        </div>
      </Portal>
    )
  }

}

export default Canvas;
