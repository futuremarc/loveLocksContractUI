import React, { Component } from 'react';
import $ from 'jquery';

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

  }


  onCloseClick(e){
    console.log('close form')
    const {closeForm} = this.props;
    closeForm();
  }

  onFormSubmit(e){
    console.log('onFormSubmit', this.props)

    let {miniToken} = this.props;

      e.preventDefault();

      let personA = window.web3.fromUtf8($('#personA').val());
      let personB = window.web3.fromUtf8($('#personB').val());
      let message = window.web3.fromUtf8($('#message').val());
      let xPos = $('#xPos').html();
      let yPos = $('#yPos').html();

      console.log('submit',personA,personB,message,xPos,yPos,window.web3.eth.accounts[0]);

      if (!personA || !personB || !message || !xPos || !yPos) return;

      miniToken.addLoveLock(personA,personB,message,xPos,yPos,{ from: window.web3.eth.accounts[0] , gas: '500000'}).then((data,err)=>{
        console.log(data,err);

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

      })
  }

  componentWillMount(){}
  componentDidMount(){}
  render(){

    const {xPos,yPos} = this.props

    return(
      <div>
        <form id="form">
          <a href="#" onClick={this.onCloseClick} id="close-modal"><span>×</span></a>
          <input id="personA"></input>
          <input id="personB"></input>
          <textarea id="message"></textarea>
          <div id="xPos">{xPos}</div>
          <div id="yPos">{yPos}</div>
          <input type="submit" onClick={this.onFormSubmit} id="submit"></input>
        </form>
      </div>
    )
  }

}

export default Form;
