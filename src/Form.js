import React, { Component } from 'react';
import $ from 'jquery';
import Portal from 'react-minimalist-portal';
import ColorPicker  from './ColorPicker';
let btn;


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
    e.preventDefault();
    console.log('close form');
    const {closeForm} = this.props;
    closeForm();
  }

  onSubmit(e){
    console.log('onSubmit', this.props)
    e.preventDefault();
    let {miniToken, getLocks} = this.props;


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

      if (!personA || !color || !personB || !msg1 || !xPos || !yPos){
        alert('Please fill all the fields.');
        return
      }
      miniToken.addLoveLock(color,personA,personB,m1,m2,m3,m4,xPos,yPos,{ from: window.web3.eth.accounts[0] , gas: '230000'}).then((data,err)=>{
        console.log(data,err);
        btn.val('Engraving... (mining block)');
        btn.attr('disabled',true);

        let filter = window.web3.eth.filter('latest');
        filter.watch((err, result)=>{
          if (!err) {
            console.log('block result',result);
            btn.val('Congrats!');
            $('#url').html(`share your lock: <a href="http://localhost:3000/${window.web3.eth.accounts[0]}">http://localhost:3000/${window.web3.eth.accounts[0]}</a>`);
            $('#reciept').html(`reciept: ${result}`);
            $('.lock-bar')[0].className += ' animate-lock';
            filter.stopWatching();
            getLocks();

          } else {
            console.error(err);
            btn.val('Sorry, something went wrong.');
          }
        })


      })
  }

  onColorPick(e){
      this.setState({
        color: e.hex
      })
  }

  componentWillMount(){
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.messages !== nextProps.messages);
  }

  componentDidMount(){
    window.stopAnimGrass();
    $('#stars div').removeClass('star-anim');
    btn = $('#submit-form');
    btn.attr('disabled',true);
    $('input').add('textarea').on('input',()=>{//disable button if form full
      if ($('#personA').val().length >= 1 && $('#personB').val().length >= 1 && $('#message').val().length >= 1 && btn.attr('disabled') == 'disabled'){
        btn.attr('disabled',false);
      }
    })
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
            <form style={{background:"#bf4040"}} className="lock">
              <div>
              <a href="#" onClick={this.onCloseClick} id="close-form"><span>×</span></a>
              <div style={{display:'none'}}><span id="xPos" className="lock-coords" data-val={xPos}>({xPos},</span><span className="lock-coords" id="yPos" data-val={yPos}>{yPos})</span></div>
              <input type="text" placeholder="You" id="personA" className="name-input" maxLength="32"></input><div className="lovers-cross">×</div><input type="text" placeholder="Your love" id="personB" className="name-input" maxLength="32"></input>
              <textarea placeholder="Enter a memory or a message" id="message" maxLength="128"></textarea>
                <div className="lock-bar">
                </div>
                <ColorPicker onColorPick={ this.onColorPick }/>
                <input type="submit" onClick={this.onSubmit} id="submit-form" value="Engrave"/>
                <div id="url"></div>
                <div id="reciept"></div>
              </div>
            </form>
        </div>
      </Portal>
    )
  }
}

export default Form;
