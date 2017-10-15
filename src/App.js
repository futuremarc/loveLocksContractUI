import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';
import Form from './Form.js'
import Canvas from './Canvas.js'

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')

const abi = [{"constant":true,"inputs":[],"name":"getLoveLockMsgs","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"lovelocks","outputs":[{"name":"color","type":"bytes8"},{"name":"personA","type":"bytes32"},{"name":"personB","type":"bytes32"},{"name":"message1","type":"bytes32"},{"name":"message2","type":"bytes32"},{"name":"message3","type":"bytes32"},{"name":"message4","type":"bytes32"},{"name":"xPos","type":"uint8"},{"name":"yPos","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_color","type":"bytes8"},{"name":"_personA","type":"bytes32"},{"name":"_personB","type":"bytes32"},{"name":"_message1","type":"bytes32"},{"name":"_message2","type":"bytes32"},{"name":"_message3","type":"bytes32"},{"name":"_message4","type":"bytes32"},{"name":"_xPos","type":"uint8"},{"name":"_yPos","type":"uint8"}],"name":"addLoveLock","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLoveLocks","outputs":[{"name":"","type":"bytes8[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"},{"name":"","type":"uint8[]"}],"payable":false,"type":"function"}];
const address = '0xc8e69905ba1b79a0d59a6dbf8e82eed483495d6d';
let MiniToken, miniToken;

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
        isFormActive: null
      }

      this.initContract = this.initContract.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);

    }


      openForm(xPos,yPos){
        this.setState({
          isFormActive: true,
          xPos:xPos,
          yPos:yPos
        });
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


        console.log(miniToken)

        miniToken.getLoveLockMsgs().then((data)=>{

          let msgs1 = String(data[0]).split(',');
          let msgs2 = String(data[1]).split(',');
          let msgs3 = String(data[2]).split(',');
          let msgs4 = String(data[3]).split(',');

          this.setState({
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

    componentWillMount() {

      if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
        console.log('found web3 already!')
       }else {
        console.log('No web3? You should consider trying MetaMask!')
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
       }

      console.log(web3.eth.defaultAccount);
      const eth = new Eth(web3.currentProvider)
      const contract = new EthContract(eth);
      this.initContract(contract);

    }

    componentDidMount() {

    }

    render() {

      let TableRows = []
      const {colors, personsA,personsB,msgs1,msgs2,msgs3,msgs4,xPoses,yPoses,xPos,yPos} = this.state;

      _.each(personsA, (value, index) => {

        TableRows.push(
          <tr key={index}>
            <td>{web3.toAscii(colors[index])}</td>
            <td>{web3.toAscii(personsA[index])}</td>
            <td>{web3.toAscii(personsB[index])}</td>
            <td>{web3.toAscii(msgs1[index])}{web3.toAscii(msgs2[index])}</td>
            <td>{xPoses[index]}</td>
            <td>{yPoses[index]}</td>
          </tr>
        )
      })

      return (
        <div className="App">
          <div className="App-header">
            <h2>crypto love locks</h2>
          </div>
          <div className="App-Content">
            <table className="App-table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Person A</th>
                  <th>Person B</th>
                  <th>Message</th>
                  <th>xPos</th>
                  <th>yPos</th>
                </tr>
              </thead>
              <tbody>
                {TableRows}
              </tbody>
            </table>
            { this.state.isCanvasReady ? <Canvas colors={colors} personsA={personsA} personsB={personsB} msgs1={msgs1} msgs2={msgs2} msgs3={msgs3} msgs4={msgs4}xPoses={xPoses} yPoses= {yPoses} openForm={this.openForm} /> : null }
            { this.state.isFormActive ? <Form miniToken={miniToken} web3={web3} xPos={xPos} yPos={yPos} closeForm={this.closeForm} /> : null }
          </div>
        </div>
      );
    }
  }

  export default App;
