import React, { Component } from 'react';
import Portal from 'react-minimalist-portal';

class About extends Component {

  constructor(props) {
    super(props);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  componentWillMount(){
  }

  componentDidMount(){
  }

  onCloseClick(e){
    e.preventDefault();
    console.log('close about');
    const {closeAbout} = this.props;
    closeAbout();
  }
  // <div id="about-header">crypto<span style={{color:'red'}}>x</span>lovelocks</div>

  render() {

    return (
      <Portal>
        <div className="about-overlay">
            <div className="about-modal">
            <div id="about-header"><img src="/logo.png"></img></div>

              <a href="#" onClick={this.onCloseClick} id="close-about"><span>×</span></a>
              <div className="web3-msg">Hello! This is a web3 decentralized application, or "dApp", to be able to create a love lock please use the <a target="_blank" href="http://metamask.io">Meta Mask</a> Chrome extension or a web3 enabled browser!</div>
              <div className="about-body"> <a href="https://en.wikipedia.org/wiki/Love_lock" target="_blank">Love locks</a> are a popular and powerful way to signify an unbreakable love and capture it forever. Unfortunately, the most popular sites around the world get their love locks taken down all the time due to hazards or other miscellaneous reasons. <br/><br/> <b>crypto<span style={{color:'red'}}>x</span>lovelocks</b> takes the love lock and puts it on the <a href="https://en.wikipedia.org/wiki/Ethereum" target="_blank">Ethereum blockchain</a> so they can never be taken down again.<br/><br/><span className="instructions">1. Choose a spot. <br/> 2. Engrave your message. <br/>3. Let your memory live on forever.</span></div>
            </div>
        </div>
      </Portal>
    )
  }
}

export default About;
