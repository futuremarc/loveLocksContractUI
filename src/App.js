import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';
import $ from 'jquery';
import Form from './Form.js'
import Canvas from './Canvas.js'

const Eth = require('ethjs-query')
const EthContract = require('ethjs-contract')

const abi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"lovelocks","outputs":[{"name":"personA","type":"bytes32"},{"name":"personB","type":"bytes32"},{"name":"message","type":"bytes32"},{"name":"xPos","type":"uint8"},{"name":"yPos","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_personA","type":"bytes32"},{"name":"_personB","type":"bytes32"},{"name":"_message","type":"bytes32"},{"name":"_xPos","type":"uint8"},{"name":"_yPos","type":"uint8"}],"name":"addLoveLock","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLoveLocks","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"},{"name":"","type":"uint8[]"}],"payable":false,"type":"function"}];
const address = '0x6f26f3ce48fa25c83bbc8a0fc8315837adfdcfef';
let MiniToken, miniToken;

let web3 = window.web3 || undefined;

  class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
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
        },()=>{
          console.log('state',this.state);
        });
      }

      closeForm(e){
        this.setState({isFormActive: null});
      }


    initContract (contract) {
      MiniToken = contract(abi);
      miniToken = MiniToken.at(address);
      console.log(miniToken);
      miniToken.getLoveLocks().then((data)=>{

        console.log('contract data',data);
        this.setState({
          personsA: String(data[0]).split(','),
          personsB: String(data[1]).split(','),
          messages: String(data[2]).split(','),
          xPoses: String(data[3]).split(','),
          yPoses: String(data[4]).split(',')
        })
      });

    }

    componentWillMount() {

      if (typeof web3 !== 'undefined') {
         // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
         console.log('found web3 already!')
       } else {
         console.log('No web3? You should consider trying MetaMask!')
         // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

       }

      console.log(web3.eth.defaultAccount);
      const eth = new Eth(web3.currentProvider)
      const contract = new EthContract(eth);
      this.initContract(contract);

    }

    componentDidMount() {}

    render() {

      let TableRows = []

      _.each(this.state.personsA, (value, index) => {

        TableRows.push(
          <tr key={index}>
            <td>{web3.toAscii(this.state.personsA[index])}</td>
            <td>{web3.toAscii(this.state.personsB[index])}</td>
            <td>{web3.toAscii(this.state.messages[index])}</td>
            <td>{this.state.xPoses[index]}</td>
            <td>{this.state.yPoses[index]}</td>
          </tr>
        )
      })

      return (
        <div className="App">
          <div className="App-header">
            <h2>crypto love locks</h2>
          </div>
          <div className="App-Content">
            <table>
              <thead>
                <tr>
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
            <Canvas openForm={this.openForm} />
            { this.state.isFormActive ? <Form miniToken={miniToken} web3={web3} xPos={this.state.xPos} yPos={this.state.yPos} closeForm={this.closeForm} /> : null }
          </div>
        </div>
      );
    }
  }

  export default App;
