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
    this.onSubmit = this.onSubmit.bind(this);
    this.onColorPick = this.onColorPick.bind(this);
  }

  onCloseClick(e){
    console.log('close form');
    const {closeForm} = this.props;
    closeForm();
  }

  onSubmit(e){
    console.log('onSubmit', this.props)

    let {miniToken} = this.props;

    e.preventDefault();
    let message = $('#message').val();
    var splitMsg = [];

    for (var i = 0; i < message.length; i += 32) {
        splitMsg.push(message.substring(i, i + 32));
    }

      let msg1 = splitMsg[0] || "";
      let msg2 = splitMsg[1] || "";
      let msg3 = splitMsg[2] || "";
      let msg4 = splitMsg[3] || "";

      let c = this.state.color || "#bf4040" //default

      let color = window.web3.fromUtf8(c);
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

      miniToken.addLoveLock(color,personA,personB,m1,m2,m3,m4,xPos,yPos,{ from: window.web3.eth.accounts[0] , gas: '240000'}).then((data,err)=>{
        console.log(data,err);
      })
  }

  onColorPick(e){
      this.setState({
        color: e.hex
      })
  }

  componentWillMount(){
  }

  componentDidMount(){
    window.stopAnimGrass();
    $('#stars div').removeClass('star-anim');
    document.body.className = document.body.className.replace("point-mouse","");
  }

  componentWillUnmount(){
    window.startAnimGrass();
    $('#stars div').addClass('star-anim');
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
            <form style={{background:"#bf4040"}} className="big-lock">
              <div>
              <a href="#" onClick={this.onCloseClick} id="close-modal"><span>×</span></a>
              <div style={{display:'none'}}><span id="xPos" className="lock-coords" data-val={xPos}>({xPos},</span><span className="lock-coords" id="yPos" data-val={yPos}>{yPos})</span></div>
              <input type="text" placeholder="First person" id="personA" className="name-input" maxLength="32"></input><span id="lovers-cross">×</span><input type="text" placeholder="Second person" id="personB" className="name-input" maxLength="32"></input>
              <textarea placeholder="Enter a memory or a message" id="message" maxLength="128"></textarea>
                <div className="lock-bar">
                </div>
                <ColorPicker onColorPick={ this.onColorPick }/>
                <input type="submit" onClick={this.onSubmit} value="Engrave"/>
              </div>
            </form>
        </div>
      </Portal>
    )
  }
}

export default Form;
