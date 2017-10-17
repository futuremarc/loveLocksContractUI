import React, { Component } from 'react';
import LockPreview from './LockPreview';
import _ from 'lodash';
let web3 = window.web3 || null

let cols = 200;
let rows = 150;
let cells = rows * cols;
let gridSize = 10;
let gW = cols * gridSize;
let gH = rows * gridSize;
let canvas, context;
let displayCnv, ctx;

let gX = 0, gY = 0, pX = 0, pY = 0, gScale = 4, speed = 2;
let mX, mY, currentLock;

let isDown = false, isDragging = false, dragTimeout = null;
let isCoordValid = false;
let isZooming = false, zoomOffX = 0, zoomOffY = 0;
const rectSize = gridSize * .8, lockBarSize = gridSize/2.85;
let settingPreviewState = false;
let mQuadrant;


class Canvas extends Component {

  constructor(props) {
    super(props);
    let data = {...props};
    this.state = {
      locks:data,
      isPreviewActive: null
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.isValidPos = this.isValidPos.bind(this);
    this.isPosTaken = this.isPosTaken.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  isValidPos(xPos,yPos,mouseX,mouseY){

    let isPosTaken = false;
    const {locks} = this.state;

    if (((xPos % 2 === 0 && yPos % 2 !== 0) || (xPos % 2 !== 0 && yPos % 2 === 0)) && !this.isPosTaken(xPos,yPos,mouseX,mouseY)){
     return true;
   }
    else{
      return false;
    }
  }

  isPosTaken(xPos,yPos,mouseX,mouseY){

    let usedUp = false;
    const {locks} = this.state;

    _.map(locks.xPoses, (value, index) => {

      if (locks.xPoses[index] == xPos && locks.yPoses[index] == yPos){
        usedUp = true;
        currentLock = {
          personA:locks.personsA[index],
          personB:locks.personsB[index],
          msg1:locks.msgs1[index],
          msg2:locks.msgs2[index],
          msg3:locks.msgs3[index],
          msg4:locks.msgs4[index],
          color:locks.colors[index],
          id: locks.ids[index]
        }
      }
    });

    if (usedUp && !settingPreviewState && !this.state.isPreviewActive){

      mX = mouseX;
      mY = mouseY;

      settingPreviewState = true;
      this.setState({
        isPreviewActive:true
      },()=>{
        settingPreviewState = false;
      })

    }

    return usedUp;
  }

  drawGrid() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(gX, gY);
    // if (isZooming) ctx.translate(pX, pY);
    ctx.scale(gScale, gScale);
    // if (isZooming) ctx.translate(-pX, -pY);

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

    let x = 0, y = 0, z = 0, counter = 0;

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
      ctx.strokeRect(x - (rectSize/2) , y+1  , rectSize, rectSize * .83);
      ctx.fillRect(x - (rectSize/2) , y+1 , rectSize, rectSize * .83);
    })
    ctx.restore();
    context.drawImage(canvas, 0, 0);
  }

  onWheel(event) {

    let e = event.nativeEvent;
    let delta = 0;

    isZooming = true;
    pX = e.pageX;
    pY = e.pageY;

    if (!e) e = window.e;
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    } else if (e.detail) {
      delta = -e.detail / 3;
    }
    if (delta) {
      this.handleWheel(delta);
    }
    isZooming = false;
    e.preventDefault();
    e.returnValue = false;
  }

  handleWheel(delta) {
    gScale += delta * 0.04;
    if (gScale < 1) gScale = 1;
    this.drawGrid();
  }

  onMouseDown(event){

    let e = event.nativeEvent;
    isDown = true;
    pX = e.pageX;
    pY = e.pageY;
    isDragging = false;
    let dragTimeout = setTimeout(()=>{
      isDragging = true;
    },75)
  }

  onMouseUp(e){
    const {openForm} = this.props;
    isDown = false;
    clearTimeout(dragTimeout);

    if (!isDragging){
      const xPos = Math.round((e.nativeEvent.offsetX/gridSize + (Math.abs(gX)/gridSize)) / gScale);
      const yPos = Math.round((e.nativeEvent.offsetY/gridSize + (Math.abs(gY)/gridSize)) / gScale);

      if (this.isValidPos(xPos,yPos)) openForm(xPos,yPos);
      else console.log('not valid position')

    }
    isDragging = false;
  }

  onMouseMove(event){
    isZooming = false; //incase wheel event still running
    let e = event.nativeEvent;

    if (e.pageX < window.innerWidth/2 && e.pageY < window.innerHeight/2){
      mQuadrant = 1;
    }else if (e.pageX > window.innerWidth/2 && e.pageY < window.innerHeight/2){
      mQuadrant = 2;
    }else if (e.pageX < window.innerWidth/2 && e.pageY > window.innerHeight/2){
      mQuadrant = 3;
    }else {
      mQuadrant = 4;
    }

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

      const xPos = Math.round((e.offsetX/gridSize + (Math.abs(gX)/gridSize)) / gScale);
      const yPos = Math.round((e.offsetY/gridSize + (Math.abs(gY)/gridSize)) / gScale);

      if (this.isValidPos(xPos,yPos,e.pageX,e.pageY) && !isCoordValid){ //first time hovering valid

        isCoordValid = true;

        ctx.clearRect(0,0,canvas.width,canvas.height); //draw validation vircle over pos
        ctx.save();
        ctx.translate(gX, gY);
        ctx.scale(gScale, gScale);
        ctx.lineWidth = gridSize/8;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(xPos * gridSize ,yPos * gridSize, gridSize/4,0,2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        context.drawImage(canvas, 0, 0);
        document.body.className += ' ' + 'point-mouse';

      } else if (!this.isValidPos(xPos,yPos) && isCoordValid){ //first time hovering invalid
        this.drawGrid();
        isCoordValid = false;
        document.body.className = document.body.className.replace("point-mouse","");

      }else if (!this.isPosTaken(xPos,yPos) && this.state.isPreviewActive){

        settingPreviewState = true;
        this.setState({
          isPreviewActive:false
        },()=>{
          settingPreviewState = false;
        })
      }
    }
  }

  onMouseOut(e){
    isDown = false;
  }

  componentWillMount(){
    console.log('componentWillMount', this.props, this.state);
  }


  componentWillReceiveProps(nextProps){ //2000 boxes per grid , find how many canvases per grid

    // (canvas.width/(gridSize * gScale))/2
    console.log('componentWillReceiveProps', this.props, this.state, nextProps)
    let data = {...nextProps};
    const {shouldGridMove,moveX,moveY} = nextProps;
    const didMoveGrid = (this.props.moveX == moveX && this.props.moveY == moveY);
    this.setState({
      locks:data
    },()=>{
      console.log('state on canvas props',this.state)
    });
    console.log('gW',gW)
    //if (gX < canvas.width - gW * gScale) gX = canvas.width - gW * gScale;
    if (shouldGridMove && !didMoveGrid){
      console.log('FIX',canvas.width/(gridSize * gScale) + (canvas.width/(gridSize * gScale)/2) ,(gridSize * gScale))
      // const cW = (gW * gScale)/(canvas.width * gScale)
      gX = (-moveX )* ((gridSize) * gScale) + canvas.width/2;
      gY = (-moveY )* ((gridSize) * gScale) + canvas.height/2;
      this.drawGrid();
    }
  }

  componentDidMount(){

    displayCnv = document.getElementById('display-canvas'); //onscreen canvas
    canvas = document.getElementById('render-canvas'); //offscreen rendering canvas
    context = displayCnv.getContext("2d"); //onscreen context
    ctx = canvas.getContext("2d"); //offscreen context
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    displayCnv.width = window.innerWidth;
    displayCnv.height = window.innerHeight;
    this.drawGrid();

    window.addEventListener('resize', (e)=>{
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      displayCnv.width = window.innerWidth;
      displayCnv.height = window.innerHeight;
      this.drawGrid();
    })
  }

  render(){

    const x = mX;
    const y = mY;
    const xy = {x:mX,y:mY};

    console.log('pos', xy)

    return(
      <div>
        <canvas onWheel={this.onWheel} onMouseDown={this.onMouseDown} onMouseOut={this.onMouseOut} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} id="display-canvas"></canvas>
        <canvas style={{display:"none"}} id="render-canvas"></canvas>
        { this.state.isPreviewActive ? <LockPreview mQuadrant={mQuadrant} xy={xy} currentLock={currentLock}/> : null }
      </div>
    )
  }

}

export default Canvas;
