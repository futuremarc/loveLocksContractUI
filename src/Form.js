import React, { Component } from 'react';
import $ from 'jquery';
import Portal from 'react-minimalist-portal';
import ColorPicker  from './ColorPicker';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color:null
    };
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

      let message = $('#message').val();

      let splitMsg = message.match(/.{32}/g);
      console.log(splitMsg)

      let msg1 = splitMsg[0] || "";
      let msg2 = splitMsg[1] || "";
      let msg3 = splitMsg[2] || "";
      let msg4 = splitMsg[3] || "";

      let color = window.web3.fromUtf8(this.state.color);
      let personA = window.web3.fromUtf8($('#personA').val());
      let personB = window.web3.fromUtf8($('#personB').val());
      let m1 = window.web3.fromUtf8(msg1);
      let m2 = window.web3.fromUtf8(msg2);
      let m3 = window.web3.fromUtf8(msg3);
      let m4 = window.web3.fromUtf8(msg4);
      let xPos = $('#xPos').data('val');
      let yPos = $('#yPos').data('val');

      console.log('submit',color, personA,personB,m1,m2,m3,m4,xPos,yPos,window.web3.eth.accounts[0]);

      if (!personA || !color || !personB || !m1 || !xPos || !yPos){
        alert('Please fill all the fields.');
        return
      }

      miniToken.addLoveLock(color,personA,personB,m1,m2,m3,m4,xPos,yPos,{ from: window.web3.eth.accounts[0] , gas: '120000'}).then((data,err)=>{
        console.log(data,err);
      })
  }

  onColorPick(e){
      console.log(e)
      this.setState({
        color: e.hex
      })
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
                    <ColorPicker onColorPick={ this.onColorPick }/>
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
