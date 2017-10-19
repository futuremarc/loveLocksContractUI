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
let lastPx, lastPy;

let isDown = false, isDragging = false, dragTimeout = null;
let isCoordValid = false;
let isZooming = false, zoomOffX = 0, zoomOffY = 0;
const rectSize = gridSize * .8, lockBarSize = gridSize/2.85;
let settingPreviewState = false;
let mQuadrant;
let activeLock;


var totalPositionsToStore = 10;
var positions = [];

function storeLastPositions(xPos, yPos) {
  // push an item
  positions.push({
    x: xPos,
    y: yPos
  });

  if (positions.length > totalPositionsToStore) {
    positions.shift();
  }
}


function drawCircle(x, y, a) {

  console.log(x,y,a)
  var alpha;
  var scale;

  if (a === -1 ) {
    // don't bother fading or scaling the trail "leader" :P
    alpha = .7;
    scale = 1;
  } else {
    // adjust the transparency and scale
    alpha = a / 2;
    scale = a;
  }

  ctx.beginPath();
  ctx.arc(x, y, scale * 15 * gScale, 0, 2 * Math.PI, true);
  ctx.fillStyle = "rgba(204, 102, 153, " + alpha + ")";
  ctx.fill();
}



function checkBoundaries(){
  if (gX > 0) gX = 0;
  if (gX < canvas.width - gW * gScale) gX = canvas.width - gW * gScale;
  if (gY > 0) gY = 0;
  if (gY < canvas.height - gH * gScale) gY = canvas.height - gH * gScale;
}



class Canvas extends Component {

  constructor(props) {
    super(props);
    let data = {...props};
    this.state = {
      locks:data,
      isPreviewActive: null,
      isLockHighlighted: null
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
    this.updateIndicator = this.updateIndicator.bind(this);
  }


  updateIndicator() {
    this.drawGrid();
    for (var i = 0; i < positions.length; i++) {
      drawCircle(positions[i].x, positions[i].y, i / positions.length);
    }

    drawCircle(mX, mY, -1);
    storeLastPositions(mX, mY);
    context.drawImage(canvas, 0, 0);
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
          xPos:locks.xPoses[index],
          yPos:locks.yPoses[index],
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
        displayCnv.className = 'default-mouse';
        settingPreviewState = false;
        this.drawGrid();
      })

    }

    return usedUp;
  }

  drawGrid() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    console.log(gX, gY)
    ctx.translate(gX, gY);
    //if (isZooming)ctx.setTransform(gScale, 0, 0, gScale, -(gScale - 1) * -gX + (canvas.width/2), -(gScale - 1) * -gY + (canvas.height/2));
    // else ctx.scale(gScale, gScale);
    ctx.scale(gScale, gScale);
    ctx.lineJoin = "round";
    ctx.lineWidth = gridSize/10;
    ctx.strokeStyle = '#bbb';

    _.map(this.state.locks.colors, (value, index) => {
      let x = this.state.locks.xPoses[index] * gridSize;
      let y = this.state.locks.yPoses[index] * gridSize;

      if ((this.state.isPreviewActive || this.state.isLockHighlighted) && this.state.locks.xPoses[index] === currentLock.xPos && this.state.locks.yPoses[index] === currentLock.yPos){
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(x,y +.5, lockBarSize * 1.1, Math.PI,0, false);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = '#bbb';
      }

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

      if ((this.state.isPreviewActive || this.state.isLockHighlighted) && this.state.locks.xPoses[index] === currentLock.xPos && this.state.locks.yPoses[index] === currentLock.yPos){
        ctx.strokeStyle = '#ffff00';
        ctx.strokeRect(x - (rectSize/2) * 1.1 , y+1  , rectSize * 1.1, rectSize * .83 * 1.05);
        ctx.fillRect(x - (rectSize/2) * 1.1 , y+1, rectSize * 1.1, rectSize * .83 * 1.05);
      }

      ctx.fillStyle = value;
      ctx.strokeStyle = value;
      ctx.strokeRect(x - (rectSize/2) , y+1  , rectSize, rectSize * .83);
      ctx.fillRect(x - (rectSize/2) , y+1 , rectSize, rectSize * .83);
    })

    ctx.strokeStyle = "#707070";
    ctx.lineWidth = gridSize * .8;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,gH);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gW + gridSize, 0);
    ctx.lineTo(gW + gridSize, gH );
    ctx.closePath();
    ctx.stroke();

    //
    // ctx.lineWidth = gridSize/3;
    // ctx.beginPath();
    // ctx.moveTo(0,0);
    // ctx.lineTo(gW + gridSize,0);
    // ctx.closePath();
    // ctx.stroke();

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
    checkBoundaries();
    this.drawGrid();
  }

  onMouseDown(event){

    let e = event.nativeEvent;
    isDown = true;
    pX = e.pageX;
    pY = e.pageY;
    // lastPx = pX;
    // lastPy = pY;

    isDragging = false;
    let dragTimeout = setTimeout(()=>{
      // console.log(lastPx , pX , lastPy , pY)
      // if (lastPx !== pX || lastPy !== pY) isDragging = true;
      isDragging = true;
    },140);
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
    let e = event.nativeEvent;

    isZooming = false; //incase wheel event still running
    mX = e.pageX;
    mY = e.pageY;

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
        checkBoundaries();
        this.drawGrid();

      }else{

      const xPos = Math.round((e.offsetX/gridSize + (Math.abs(gX)/gridSize)) / gScale);
      const yPos = Math.ceil((e.offsetY/gridSize + (Math.abs(gY)/gridSize)) / gScale);

      if (this.isValidPos(xPos,yPos,e.pageX,e.pageY) && !isCoordValid){ //first time hovering valid

        isCoordValid = true;

        ctx.clearRect(0,0,canvas.width,canvas.height); //draw validation vircle over pos
        ctx.save();

        ctx.translate(gX, gY);
        ctx.scale(gScale, gScale);
        ctx.lineWidth = gridSize/8;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(xPos * gridSize,yPos * gridSize, gridSize/4,0,2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        context.drawImage(canvas, 0, 0);
        displayCnv.className = 'point-mouse';

      } else if (!this.isValidPos(xPos,yPos) && isCoordValid){ //first time hovering invalid
        this.drawGrid();
        isCoordValid = false;
        displayCnv.className = '';

      }else if (!this.isPosTaken(xPos,yPos) && this.state.isPreviewActive){

        settingPreviewState = true;
        this.setState({
          isPreviewActive:null,
          isLockHighlighted: null
        },()=>{
          displayCnv.className = '';
          settingPreviewState = false;
          currentLock = null;
        })
      }
    }
    //this.updateIndicator();
  }

  onMouseOut(e){
    isDown = false;
  }

  componentWillMount(){
    console.log('componentWillMount', this.props, this.state);
  }


  componentWillReceiveProps(nextProps){

    console.log('componentWillReceiveProps', this.props, this.state, nextProps)
    let data = {...nextProps};
    const {shouldGridMove,moveX,moveY,shouldZoom, zoomDirection} = nextProps;
    const didMoveGrid = (this.props.moveX == moveX && this.props.moveY == moveY);
    this.setState({
      locks:data
    },()=>{
      this.drawGrid()
    });

    if (shouldGridMove && !didMoveGrid){

      this.setState({
        isLockHighlighted: true
      },()=>{
        currentLock = {
          xPos: moveX,
          yPos: moveY
        }
        gScale = 10;
        gX = (-moveX )* ((gridSize) * gScale) + canvas.width/2;
        gY = (-moveY )* ((gridSize) * gScale) + canvas.height/2;

        checkBoundaries();
        this.drawGrid();
      })

    }else if (shouldZoom){
      isZooming = true;
      if (zoomDirection == 'zoom-out' && gScale > 1)gScale -= .75;
      else if (zoomDirection == 'zoom-in') gScale += .75;

      checkBoundaries();
      this.drawGrid();
      isZooming = false;
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
