import React, { Component } from 'react';
import _ from 'lodash';

let cols = 500;
let rows = 200;
let cells = rows * cols;
let gridSize = 10;
let gW = cols * gridSize;
let gH = rows * gridSize;
let canvas, context;
let displayCnv, ctx;
let web3 = window.web3 || null

let gX = 0,
    gY = 0,
    pX = 0,
    pY = 0,
    gScale = 4,
    speed = 2;

let isDown = false, isDragging = false, dragTimeout = null;
let isCoordValid = false;

const rectSize = gridSize * .8;
const lockBarSize = gridSize/2.85;

function isValidPos(xPos,yPos){
  if ((xPos % 2 === 0 && yPos % 2 !== 0) || (xPos % 2 !== 0 && yPos % 2 === 0)) return true;
  else return false;
}


class Canvas extends Component {

  constructor(props) {
    super(props);

    let data = {...props};
    this.state = {
      locks:data
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
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
    gScale += delta * 0.04;
    if (gScale < 1) gScale = 1;
    this.drawGrid();
  }


  drawGrid() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(gX, gY);
    ctx.scale(gScale, gScale);


    ctx.lineJoin = "round";
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = gridSize/10;

    _.map(this.state.locks.colors, (value, index) => {
      let x = this.state.locks.xPoses[index] * gridSize;
      let y = this.state.locks.yPoses[index] * gridSize;

      ctx.beginPath();
      ctx.arc(x,y +.5, lockBarSize, Math.PI,0, false);
      ctx.closePath();
      ctx.stroke();

    })

    ctx.strokeStyle = "#666";
    ctx.lineWidth = gridSize/10;
    ctx.beginPath();

    let x = 0;
    let y = 0;
    let z = 0;
    let counter = 0;

    for(let i = 0; i < Math.round(gH/gridSize); i++){

      let z = counter;
      while(x <= gridSize*Math.round(gW/gridSize)){

        if(z%2 == 0){
          ctx.moveTo( x, y+gridSize );
          ctx.lineTo( x+gridSize, y );
        }
        else{
          ctx.moveTo(x,y);
          ctx.lineTo(x+gridSize, y+gridSize);
        }

        x += gridSize;
        z += 1;
      }

      x = 0;
      y = y + gridSize;
      counter += 1;

    }

    ctx.stroke();
    ctx.lineWidth = gridSize/5;

    _.map(this.state.locks.colors, (value, index) => {
      let x = this.state.locks.xPoses[index] * gridSize;
      let y = this.state.locks.yPoses[index] * gridSize;

      ctx.fillStyle = value;
      ctx.strokeStyle = value;
      ctx.strokeRect(x - (rectSize/2) , y+1  , rectSize, rectSize);
      ctx.fillRect(x - (rectSize/2) , y+1 , rectSize, rectSize);

    })
    ctx.restore();
    context.drawImage(canvas, 0, 0);

  }


  onMouseDown(e){
    isDown = true;
    pX = e.pageX;
    pY = e.pageY;
    isDragging = false;
    let dragTimeout = setTimeout(()=>{
      isDragging = true;
    },100)
  }

  onMouseUp(e){
    const {openForm} = this.props;
    isDown = false;
    clearTimeout(dragTimeout);
    if (!isDragging){
      const xPos = Math.round((e.nativeEvent.offsetX/gridSize + (Math.abs(gX)/gridSize)) / gScale);
      const yPos = Math.round((e.nativeEvent.offsetY/gridSize + (Math.abs(gY)/gridSize)) / gScale);

      if (isValidPos(xPos,yPos)) openForm(xPos,yPos);
      else console.log('not valid position')

    }
    isDragging = false;
  }

  onMouseMove(e){
    if (isDown) {

        gX += -(pX - e.pageX) * speed;
        gY += -(pY - e.pageY) * speed;
        pX = e.pageX;
        pY = e.pageY;
        if (gX > 0) gX = 0;
        if (gX < canvas.width - gW * gScale) gX = canvas.width - gW * gScale;
        if (gY > 0) gY = 0;
        if (gY < canvas.height - gH * gScale) gY = canvas.height - gH * gScale;
        this.drawGrid();

    }else{

      const xPos = Math.round((e.nativeEvent.offsetX/gridSize + (Math.abs(gX)/gridSize)) / gScale);
      const yPos = Math.round((e.nativeEvent.offsetY/gridSize + (Math.abs(gY)/gridSize)) / gScale);

      if (isValidPos(xPos,yPos) && !isCoordValid){ //first time hovering valid

        isCoordValid = true;
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.save();
        ctx.translate(gX, gY);
        ctx.scale(gScale, gScale);
        ctx.lineWidth = gridSize/8;
        ctx.strokeStyle = "#00ff00";
        ctx.beginPath();
        ctx.arc(xPos * gridSize ,yPos * gridSize, gridSize/4,0,2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        context.drawImage(canvas, 0, 0);

      }else if (!isValidPos(xPos,yPos) && isCoordValid){ //first time hovering invalid
        this.drawGrid();
        isCoordValid = false;
      }
    }
  }

  onMouseOut(e){
    isDown = false;
  }

  componentWillMount(){
    console.log('componentWillMount', this.props, this.state);
  }

  componentDidMount(){

    displayCnv = document.getElementById('grid-canvas');
    context = displayCnv.getContext("2d");
    canvas = document.createElement('canvas');
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    displayCnv.width = window.innerWidth;
    displayCnv.height = window.innerHeight;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.font = "14px sans-serif";

    this.drawGrid();

    displayCnv.addEventListener('DOMMouseScroll', this.wheel, false);
    displayCnv.onmousewheel = displayCnv.onmousewheel = this.wheel;

    window.addEventListener('resize', (e)=>{
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      displayCnv.width = window.innerWidth;
      displayCnv.height = window.innerHeight;
      this.drawGrid();
    })

  }

  render(){

    return(
        <canvas onMouseDown={this.onMouseDown} onMouseOut={this.onMouseOut} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} id="grid-canvas"></canvas>
    )
  }

}


export default Canvas;
