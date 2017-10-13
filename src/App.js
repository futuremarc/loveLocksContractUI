import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';

let ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const loveLocksContractABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"lovelocks","outputs":[{"name":"personA","type":"bytes32"},{"name":"personB","type":"bytes32"},{"name":"message","type":"bytes32"},{"name":"xPos","type":"uint8"},{"name":"yPos","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_personA","type":"bytes32"},{"name":"_personB","type":"bytes32"},{"name":"_message","type":"bytes32"},{"name":"_xPos","type":"uint8"},{"name":"_yPos","type":"uint8"}],"name":"addLoveLock","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLoveLocks","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"},{"name":"","type":"uint8[]"}],"payable":false,"type":"function"}];

const loveLocksContractAddress = '0xbf36d4a594cd2917f991ce23c1a42c73da31eb22';
let loveLocksContract = ETHEREUM_CLIENT.eth.contract(loveLocksContractABI).at(loveLocksContractAddress);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      personsA: [],
      personsB: [],
      messages: [],
      xPoses: [],
      yPoses: []
    }
  }

  componentWillMount() {
    let data = loveLocksContract.getLoveLocks();
    console.log(data);
    this.setState({
      personsA: String(data[0]).split(','),
      personsB: String(data[1]).split(','),
      messages: String(data[2]).split(','),
      xPoses: String(data[3]).split(','),
      yPoses: String(data[4]).split(',')
    })
  }
  render() {

    let TableRows = []

    _.each(this.state.personsA, (value, index) => {

      TableRows.push(
        <tr key={index}>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.personsA[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.personsB[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.messages[index])}</td>
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
        </div>
      </div>
    );
  }
}

export default App;
