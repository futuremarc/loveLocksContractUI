import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Form from './Form';
import Canvas from './Canvas';
import About from './About';
import SearchBar from './SearchBar'

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');
const abi = [{"constant":true,"inputs":[],"name":"getLoveLockMsgs","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"lovelocks","outputs":[{"name":"color","type":"bytes8"},{"name":"personA","type":"bytes32"},{"name":"personB","type":"bytes32"},{"name":"message1","type":"bytes32"},{"name":"message2","type":"bytes32"},{"name":"message3","type":"bytes32"},{"name":"message4","type":"bytes32"},{"name":"xPos","type":"uint8"},{"name":"yPos","type":"uint8"},{"name":"id","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_color","type":"bytes8"},{"name":"_personA","type":"bytes32"},{"name":"_personB","type":"bytes32"},{"name":"_message1","type":"bytes32"},{"name":"_message2","type":"bytes32"},{"name":"_message3","type":"bytes32"},{"name":"_message4","type":"bytes32"},{"name":"_xPos","type":"uint8"},{"name":"_yPos","type":"uint8"}],"name":"addLoveLock","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLoveLocks","outputs":[{"name":"","type":"bytes8[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"},{"name":"","type":"uint8[]"},{"name":"","type":"address[]"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"}],"name":"txRecieved","type":"event"}]
const address = '0x8b57723c23BAdd2878530a06a98548072B1EE516'; //0x8b57723c23BAdd2878530a06a98548072B1EE516 rinke
let MiniToken, miniToken;
let web3 = window.web3 || null;
let didRetry = false;


  class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isFormActive: null,
        isCanvasReady:null,
        isAboutActive:true,
        shouldGridMove: null,
        shouldZoom:null
      }

      this.initContract = this.initContract.bind(this);
      this.getLocks = this.getLocks.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.moveGrid = this.moveGrid.bind(this);
      this.zoom = this.zoom.bind(this);
      this.openAbout = this.openAbout.bind(this);
      this.closeAbout = this.closeAbout.bind(this);
      this.connectWeb3 = this.connectWeb3.bind(this);
      this.setTx = this.setTx.bind(this);
    }

    openForm(xPos,yPos){
      this.setState({
        isFormActive: true,
        xPos:xPos,
        yPos:yPos
      });
    }

    zoom(e){
      const direction = e.nativeEvent.target.id;
      this.setState({
        shouldZoom:true,
        zoomDirection:direction
      },()=>{
        this.setState({
          shouldZoom:null,
          zoomDirection:null
        })
      })
    }

    closeForm(e){
      this.setState({isFormActive: null});
    }

    getLocks(){
      let getMain = new Promise((resolve, reject)=>{

        miniToken.getLoveLocks().then((data)=>{
          let colors = String(data[0]).split(',');
          let personsA = String(data[1]).split(',');
          let personsB = String(data[2]).split(',');
          let xPoses = String(data[3]).split(',');
          let yPoses = String(data[4]).split(',');
          let ids = String(data[5]).split(',');

          colors.map((item,index)=>{
            let str = web3.toAscii(item);
            colors[index] = str.substring(0,7);
          })
          personsA.map((item,index)=>{
            personsA[index] = web3.toAscii(item);
          })
          personsB.map((item,index)=>{
            personsB[index] = web3.toAscii(item);
          })

          let locks = {colors,personsA,personsB, xPoses, yPoses,ids}
          resolve(locks);

        });
      })

      let getMsgs = new Promise((resolve, reject)=>{

        miniToken.getLoveLockMsgs().then((data)=>{
          let msgs1 = String(data[0]).split(',');
          let msgs2 = String(data[1]).split(',');
          let msgs3 = String(data[2]).split(',');
          let msgs4 = String(data[3]).split(',');

          msgs1.map((item,index)=>{
            msgs1[index] = web3.toAscii(item);
          })
          msgs2.map((item,index)=>{
            msgs2[index] = web3.toAscii(item);
          })
          msgs3.map((item,index)=>{
            msgs3[index] = web3.toAscii(item);
          })
          msgs4.map((item,index)=>{
            msgs4[index] = web3.toAscii(item);
          })

          let msgs = {msgs1,msgs2,msgs3,msgs4};
          resolve(msgs);
        });
      });

      Promise.all([getMain, getMsgs]).then(vals => {
        this.setState({
          ids: vals[0].ids,
          colors: vals[0].colors,
          personsA: vals[0].personsA,
          personsB: vals[0].personsB,
          xPoses: vals[0].xPoses,
          yPoses: vals[0].yPoses,
          msgs1: vals[1].msgs1,
          msgs2: vals[1].msgs2,
          msgs3: vals[1].msgs3,
          msgs4: vals[1].msgs4,
          isCanvasReady: true
        })
      });
    }


    initContract (contract) {

      MiniToken = contract(abi);
      miniToken = MiniToken.at(address);
      const {txHash} = this.state;

      let filter = web3.eth.filter("latest",function(error, blockHash) {
        if (!error) {
          web3.eth.getBlock(blockHash, false, (block)=>{
            if (!block) return
            if (block.length > 0) {
              console.log("found " + block.length + " transactions in block " + blockHash);
              console.log(JSON.stringify(block));

              if (!txHash) return

              block.forEach((item,index)=>{
                console.log(item,txHash)
                if (item === txHash) console.log('MATCH!')
                else console.log('NO MATCH');
              });
            } else {
                console.log("no transaction in block: " + blockHash);
              }

          });
        }
        this.getLocks();

      }.bind(this));

      this.getLocks();
    }

    moveGrid(x,y){
      this.setState({
        shouldGridMove:true,
        isAboutActive:null,
        moveX:x,
        moveY:y
      },()=>{
        this.setState({
          shouldGridMove:null,
          moveX:null,
          moveY:null
        })
      })
    }

    connectWeb3(){
      if (typeof web3 !== 'undefined' && web3 != null) {
        if (web3.currentProvider){
        console.log('found web3 already!')
        window.web3 = new Web3(web3.currentProvider);
        const eth = new Eth(web3.currentProvider)
        const contract = new EthContract(eth);
        this.initContract(contract);
      }
    } else if (!didRetry){
      setTimeout(this.connectWeb3,1000);
    } else{
        const eth = new Eth(web3.currentProvider);
        const contract = new EthContract(eth);
        this.initContract(contract);
      }
    }

    componentWillMount() {
      window.addEventListener('load', this.connectWeb3);
    }

    componentDidMount() {
      window.initGarden();
    }

    openAbout(){
      this.setState({
        isAboutActive: true
      });
    }

    closeAbout(){
      this.setState({
        isAboutActive: null
      });
    }

    setTx(hash){
      this.setState({
        txHash:hash
      })
    }


    render() {

      let TableRows = []
      const {colors, personsA, personsB, msgs1, msgs2, msgs3, msgs4,xPoses,yPoses,xPos,yPos, ids} = this.state;
      const {shouldGridMove, moveX, moveY,shouldZoom, zoomDirection} = this.state;
      console.log('this.state on render',this.state)

      return (
        <div className="App">
          { this.state.isCanvasReady ? <Canvas moveX={moveX} shouldZoom={shouldZoom} zoomDirection={zoomDirection} moveY={moveY} colors={colors} ids={ids} personsA={personsA} personsB={personsB} msgs1={msgs1} msgs2={msgs2} msgs3={msgs3} msgs4={msgs4} xPoses={xPoses} yPoses= {yPoses} shouldGridMove={shouldGridMove} openForm={this.openForm} /> : null }
          { this.state.isFormActive ? <Form moveGrid={this.moveGrid} xPoses={xPoses} yPoses={yPoses} setTx={this.setTx} miniToken={miniToken} web3={web3} xPos={xPos} yPos={yPos} closeForm={this.closeForm} /> : null }
          { this.state.isAboutActive ? <About closeAbout={this.closeAbout} /> : null }
          <div onMouseDown={this.openAbout} id="header"><img src="/logo-white.png"></img></div>

          <SearchBar moveX={moveX} moveY={moveY} moveGrid={this.moveGrid} xPoses={xPoses} yPoses= {yPoses} ids={ids}/>
          <div id="zoom-btns">
            <div onMouseDown={this.zoom}className="zoom" id="zoom-in">+</div>
            <div onMouseDown={this.zoom}className="zoom" id="zoom-out">—</div>
          </div>
          <div id="about-btn">ℹ</div>

        </div>
      );
    }
  }

  export default App;
