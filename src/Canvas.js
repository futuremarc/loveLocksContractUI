import React, { Component } from 'react';
import _ from 'lodash';

let cols = 1000;
let rows = 200;
let cells = rows * cols;
let size = 50;
let gW = cols * size;
let gH = rows * size;
let canvas, ctx;
let web3 = window.web3 || null

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
    super(props);

    let data = {...props};
    this.state = {
      locks:data
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

  componentWillReceiveProps(nextProps){

      console.log('componentWillReceiveProps', this.props, this.state, nextProps)

        let data = {...nextProps};

        this.state = {
          locks:data
        };

  }


  handle(delta) {
    gScale += delta * 0.01;
    if (gScale < .1) gScale = .1;
    this.drawGrid();
  }


  drawGrid() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(gX, gY);
    ctx.scale(gScale, gScale);


      const rectSize = 40;
      const circSize = 15;
      let cornerRadius = 25;
      ctx.lineJoin = "round";
      ctx.lineWidth = cornerRadius;

      _.map(this.state.locks.colors, (value, index) => {
        let x = this.state.locks.xPoses[index] * size;
        let y = this.state.locks.yPoses[index] * size;

        ctx.strokeStyle = '#ddd';

        ctx.beginPath();
        ctx.arc(x,y , circSize, Math.PI,0, false);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.stroke();

      })

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#666";
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


    cornerRadius = 10;
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    _.map(this.state.locks.colors, (value, index) => {
      let x = this.state.locks.xPoses[index] * size;
      let y = this.state.locks.yPoses[index] * size;

      ctx.fillStyle = value;
      ctx.strokeStyle = value;
      ctx.strokeRect(x - (rectSize/2) , y+2  , rectSize, rectSize);
      ctx.fillRect(x - (rectSize/2) , y+2 , rectSize, rectSize);

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
    console.log('componentWillMount', this.props, this.state);
  }

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
