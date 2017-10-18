import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';
import Form from './Form';
import Canvas from './Canvas';
import About from './About';
import SearchBar from './SearchBar'

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

const abi = [{"constant":true,"inputs":[],"name":"getLoveLockMsgs","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"lovelocks","outputs":[{"name":"color","type":"bytes8"},{"name":"personA","type":"bytes32"},{"name":"personB","type":"bytes32"},{"name":"message1","type":"bytes32"},{"name":"message2","type":"bytes32"},{"name":"message3","type":"bytes32"},{"name":"message4","type":"bytes32"},{"name":"xPos","type":"uint8"},{"name":"yPos","type":"uint8"},{"name":"id","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_color","type":"bytes8"},{"name":"_personA","type":"bytes32"},{"name":"_personB","type":"bytes32"},{"name":"_message1","type":"bytes32"},{"name":"_message2","type":"bytes32"},{"name":"_message3","type":"bytes32"},{"name":"_message4","type":"bytes32"},{"name":"_xPos","type":"uint8"},{"name":"_yPos","type":"uint8"}],"name":"addLoveLock","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLoveLocks","outputs":[{"name":"","type":"bytes8[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"},{"name":"","type":"uint8[]"},{"name":"","type":"address[]"}],"payable":false,"type":"function"}];
const address = '0x4a21a48052721b746be58592522a29743e03de2a';
let MiniToken, miniToken;

function retryWeb3Provider(){
  let eth, contract;

  if (web3.currentProvider){
    console.log('found web3 on retry')
  }else{
    console.log('no web3 on retry')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  eth = new Eth(web3.currentProvider);
  contract = new EthContract(eth);
  this.initContract(contract);
}

let web3 = window.web3 || null;

  class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        colors:[],
        personsA: [],
        personsB: [],
        messages: [],
        xPoses: [],
        yPoses: [],
        isFormActive: null,
        isCanvasReady:null,
        isAboutActive:true,
        shouldGridMove: null,
        shouldZoom:null
      }

      this.initContract = this.initContract.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.moveGrid = this.moveGrid.bind(this);
      this.zoom = this.zoom.bind(this);
      this.openAbout = this.openAbout.bind(this);
      this.closeAbout = this.closeAbout.bind(this);
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


    initContract (contract) {

      MiniToken = contract(abi);
      miniToken = MiniToken.at(address);

      miniToken.getLoveLocks().then((data)=>{
        let colors = String(data[0]).split(',');
        let personsA = String(data[1]).split(',');
        let personsB = String(data[2]).split(',');
        let xPoses = String(data[3]).split(',');
        let yPoses = String(data[4]).split(',');
        let ids = String(data[5]).split(',');

        console.log(miniToken)

        miniToken.getLoveLockMsgs().then((data)=>{

          let msgs1 = String(data[0]).split(',');
          let msgs2 = String(data[1]).split(',');
          let msgs3 = String(data[2]).split(',');
          let msgs4 = String(data[3]).split(',');

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

          this.setState({
            ids: ids,
            colors: colors,
            personsA: personsA,
            personsB: personsB,
            xPoses: xPoses,
            yPoses: yPoses,
            msgs1: msgs1,
            msgs2: msgs2,
            msgs3: msgs3,
            msgs4: msgs4,
            isCanvasReady: true
          })
        });

      });

    }

    moveGrid(x,y){
      this.setState({
        shouldGridMove:true,
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

    componentWillMount() {

      if (typeof web3 !== 'undefined' && web3 != null) {

        if (web3.currentProvider){
        console.log('found web3 already!')
        window.web3 = new Web3(web3.currentProvider);
        const eth = new Eth(web3.currentProvider)
        const contract = new EthContract(eth);
        this.initContract(contract);

        } else {
            setTimeout(retryWeb3Provider,700);
          }

       } else {
        console.log('No web3? You should consider trying MetaMask!')
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        const eth = new Eth(web3.currentProvider)
        const contract = new EthContract(eth);
        this.initContract(contract);
       }
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


    render() {

      let TableRows = []
      const {colors, personsA, personsB, msgs1, msgs2, msgs3, msgs4,xPoses,yPoses,xPos,yPos, ids} = this.state;
      const {shouldGridMove, moveX, moveY,shouldZoom, zoomDirection} = this.state;
      console.log('this.state on render',this.state)

      return (
        <div className="App">
          { this.state.isCanvasReady ? <Canvas moveX={moveX} shouldZoom={shouldZoom} zoomDirection={zoomDirection} moveY={moveY} colors={colors} ids={ids} personsA={personsA} personsB={personsB} msgs1={msgs1} msgs2={msgs2} msgs3={msgs3} msgs4={msgs4} xPoses={xPoses} yPoses= {yPoses} shouldGridMove={shouldGridMove} openForm={this.openForm} /> : null }
          { this.state.isFormActive ? <Form miniToken={miniToken} web3={web3} xPos={xPos} yPos={yPos} closeForm={this.closeForm} /> : null }
          { this.state.isAboutActive ? <About closeAbout={this.closeAbout} /> : null }

          <div id="header"><img src="/logo-white.png"></img></div>
          <SearchBar moveX={moveX} moveY={moveY} moveGrid={this.moveGrid} xPoses={xPoses} yPoses= {yPoses} ids={ids}/>
          <div onMouseDown={this.zoom}className="zoom" id="zoom-in"><img id="in" src="/zoom-in.png"></img></div>
          <div onMouseDown={this.zoom}className="zoom" id="zoom-out"><img id="out" src="/zoom-out.png"></img></div>
          <div onMouseDown={this.openAbout} id="about-btn">?</div>

        </div>
      );
    }
  }

  export default App;
