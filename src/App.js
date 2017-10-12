import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';

let ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const relationsContractABI = [{"constant":true,"inputs":[],"name":"getRelations","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstNameA","type":"bytes32"},{"name":"_lastNameA","type":"bytes32"},{"name":"_firstNameB","type":"bytes32"},{"name":"_lastNameB","type":"bytes32"}],"name":"addRelation","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"relations","outputs":[{"name":"firstNameA","type":"bytes32"},{"name":"lastNameA","type":"bytes32"},{"name":"firstNameB","type":"bytes32"},{"name":"lastNameB","type":"bytes32"}],"payable":false,"type":"function"}];

const relationsContractAddress = '0x7637f8ac9cf035a5e537187a82fb10516d7c25f0';
let relationsContract = ETHEREUM_CLIENT.eth.contract(relationsContractABI).at(relationsContractAddress);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstNamesA: [],
      lastNamesA: [],
      firstNamesB: [],
      lastNamesB: [],
    }
  }

  componentWillMount() {
    let data = relationsContract.getRelations();
    console.log(data);
    this.setState({
      firstNamesA: String(data[0]).split(','),
      lastNamesA: String(data[1]).split(','),
      firstNamesB: String(data[2]).split(','),
      lastNamesB: String(data[3]).split(',')
    })
  }
  render() {

    let TableRows = []

    _.each(this.state.firstNamesA, (value, index) => {
      TableRows.push(
        <tr key={value}>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.firstNamesA[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.lastNamesA[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.firstNamesB[index])}</td>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.lastNamesB[index])}</td>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Last Name</th>
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
