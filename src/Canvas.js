import React, { Component } from 'react';
import _ from 'lodash';

let cols = 300;
let rows = 100;
let cells = rows * cols;
let size = 50;
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

class Canvas extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data:null
    };
    this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
    this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
    this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
    this.onCanvasMouseOut = this.onCanvasMouseOut.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.handle = this.handle.bind(this);
    this.wheel = this.wheel.bind(this);
  }

  wheel(event) {
    let delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    if (delta) {
        this.handle(delta);
    }
    event.preventDefault();
    event.returnValue = false;
  }


  handle(delta) {
    gScale += delta * 0.01;
    if (gScale < .1) gScale = .1;
    this.drawGrid();
  }


  drawGrid() {
    const {xPoses, yPoses, colors} = this.props;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(gX, gY);
    ctx.scale(gScale, gScale);

    // for (let i = 0; i < cols; ++i) {
    //
    //      for (let j = 0; j < rows; ++j) {
    //          ctx.fillRect(i * size, j * size, size, size);
    //          ctx.strokeRect(i * size, j * size, size, size);
    //          //ctx.fillText("box " + j + ", " + i, size, size);
    //      }
    //  }

      // let bgGradient = ctx.createLinearGradient(0, 0, 0, gW/3);
      // bgGradient.addColorStop(0, "#434265");
      // bgGradient.addColorStop(0.5, "#E76867");
      // bgGradient.addColorStop(1, "#FCBB9D");
      // ctx.fillStyle = bgGradient;
      // ctx.fillRect(0, 0, gW, gH);
      //136378 130463
      //112674 107527
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 4;
      ctx.beginPath();
      let x = 0;
      let y = 0;
      let z = 0;
      let counter = 0;

      for(let i = 0; i < Math.round(gH/size); i++){

        let z = counter;
        while(x <= size*Math.round(gW/size)){

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


    _.each(xPoses, (value, index) => {
      ctx.strokeStyle = '#' + colors[index];
      ctx.beginPath();
      ctx.arc(xPoses[index] * size,yPoses[index] * size,10,0,2*Math.PI);
      ctx.stroke();
    })

    ctx.restore();

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
      //if (gX > 0) gX = 0;
      //if (gX < canvas.width - gW * gScale) gX = canvas.width - gW * gScale;
      //if (gY > 0) gY = 0;
      //if (gY < canvas.height - gH * gScale) gY = canvas.height - gH * gScale;
       this.drawGrid();
    }
  }

  onCanvasMouseOut(e){
    isDown = false;
  }

  componentWillMount(){


  }

  componentWillReceiveProps(){}

  componentDidMount(){

    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.font = "14px sans-serif";

    this.drawGrid();

    canvas.addEventListener('DOMMouseScroll', this.wheel, false);
    canvas.onmousewheel = canvas.onmousewheel = this.wheel;

    window.addEventListener('resize', (e)=>{
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.drawGrid();
    })

  }

  render(){

    return(
        <canvas onMouseDown={this.onCanvasMouseDown} onMouseOut={this.onCanvasMouseOut} onMouseMove={this.onCanvasMouseMove} onMouseUp={this.onCanvasMouseUp} id="canvas"></canvas>
    )
  }

}


export default Canvas;
