import React, { Component } from 'react';
import $ from 'jquery';
import Portal from 'react-minimalist-portal';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onColorPick = this.onColorPick.bind(this);
  }

  onCloseClick(e){
    console.log('close form');
    const {closeForm} = this.props;
    closeForm();
  }

  onFormSubmit(e){
    console.log('onFormSubmit', this.props)

    let {miniToken} = this.props;

      e.preventDefault();

      let message = window.web3.fromUtf8($('#message').val());

      var splitMsg = message.match(/.{3}/g);

      let color = window.web3.fromUtf8($('#color').val());
      let personA = window.web3.fromUtf8($('#personA').val());
      let personB = window.web3.fromUtf8($('#personB').val());
      let message1 = splitMsg[0];
      let message2 = splitMsg[1];
      let message3 = splitMsg[2];
      let message4 = splitMsg[3];
      let xPos = $('#xPos').data('val');
      let yPos = $('#yPos').data('val');

      console.log('submit',personA,personB,message1,message2,message3,message4,xPos,yPos,window.web3.eth.accounts[0]);

      if (!personA || !color || !personB || !message1 || !xPos || !yPos){
        alert('Please fill all the fields.');
        return
      }

      miniToken.addLoveLock(personA,personB,message1,xPos,yPos,{ from: window.web3.eth.accounts[0] , gas: '120000'}).then((data,err)=>{
        console.log(data,err);
      })
  }

  onColorPick(e){
      console.log(e.currentTarget.value)
      $(e.currentTarget).val(e.currentTarget.value);
  }

  componentWillMount(){
  }
  componentDidMount(){

  }
  render(){

    const {xPos,yPos} = this.props

    const settings = {
      body: <div>POPOVER</div>,
      isOpen: true,
      preferPlace: 'above',
      place: 'above'
    };

    return(
      <Portal>
        <div key="overlay" className="modal-overlay">
          <div className="modal">
          <a href="#" onClick={this.onCloseClick} id="close-modal"><span>×</span></a>
            <div className="container-fluid">
              <div className="row">

                <div className="form-group col-xs-12 col-md-6 col-lg-6 col-xl-6">
                  <div id="form-header">Details to engrave on your Love Lock</div>
                  <form id="form">
                    <input type="color" id="color" value="#ff0000" onChange={this.onColorPick} ></input>
                    <input placeholder="Enter the first person's name" className="form-control" id="personA"></input>
                    <input placeholder="Enter the second person's name" className="form-control" id="personB"></input>
                    <textarea placeholder="Enter a memory or a message"rows="3" className="form-control" id="message"></textarea>
                    <input type="submit" className="form-control btn-default" onClick={this.onFormSubmit} id="submit"></input>
                  </form>
                </div>
                <div className="lock-canvas-col col-xs-12 col-md-6 col-lg-6 col-xl-6">
                  <div id="lock-header">
                    <span>Your location on the fence is: </span> <span id="xPos" className="lock-coords" data-val={xPos}>({xPos},</span><span className="lock-coords" id="yPos" data-val={yPos}>{yPos})</span>
                  </div>
                  <div id="lock-canvas"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    )
  }

}

export default Form;
