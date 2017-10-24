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
    const {closeAbout} = this.props;
    closeAbout();
  }
  // <div id="about-header">crypto<span style={{color:'red'}}>x</span>lovelocks</div>

  render() {

    return (
      <Portal>
        <div className="about-overlay">
            <div className="about-modal">

              <a href="#" onClick={this.onCloseClick} id="close-about"><span>×</span></a>
              <div id="about-header"><img src="/logo.png"></img></div>

              <div className="about-body"> <span id="short-title">Crypto LoveLocks</span> is a <a href="https://github.com/DavidJohnstonCEO/DecentralizedApplications/blob/master/README.md" target="_blank">decentralized application (ÐApp)</a> that creates love locks on the blockchain.<br/><br/><div className="instructions">1. Click an empty spot on the fence. <br/> 2. Engrave your message. <br/>3. Let your memory live on forever.</div><br/> <a href="https://en.wikipedia.org/wiki/Love_lock" target="_blank">Love locks</a> are a popular and powerful way to signify an unbreakable love and capture it forever. Unfortunately, even the most popular sites around the world get their love locks taken down due to hazards or other reasons. So what else can we do but put them on the <a href="https://en.wikipedia.org/wiki/Ethereum" target="_blank">Ethereum blockchain</a> so they can never be taken down again? There are a total amount of 50,000 spots available on the fence and in the <a href="https://en.wikipedia.org/wiki/Smart_contract">smart contract</a>, 10,000 shown at a time.<br/><br/><br/> *Please use the <a target="_blank" href="http://metamask.io">Meta Mask</a> Chrome extension or a Web3 enabled browser.</div><div className="warning">MetaMask is currently experiencing a bug, you may have to disable it and sign back in to use Web3 enabled apps</div>
            </div>
        </div>
      </Portal>
    )
  }
}

export default About;
// <div id="about-header"><img src="/logo.png"></img></div>

// <div className="web3-msg">Hello! This is a web3 decentralized application, or "dApp", to be able to create a love lock please use the <a target="_blank" href="http://metamask.io">Meta Mask</a> Chrome extension or a web3 enabled browser!</div>
