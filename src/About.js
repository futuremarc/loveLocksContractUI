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
    console.log('close about');
    const {closeAbout} = this.props;
    closeAbout();
  }

  render() {

    return (
      <Portal>
        <div className="about-overlay">
            <div className="about-modal">
              <a href="#" onClick={this.onCloseClick} id="close-about"><span>×</span></a>
              <div id="about-header"><img src="/logo-black.png"></img></div>
              <div className="about-body"><div className="web3-msg">Hello! This is a web3 decentralized application, or "dApp", please use the <a target="_blank" src="http://metamask.io">Meta Mask</a> Chrome extension or a web3 enabled browser!</div> <br/><br/> <a href="https://en.wikipedia.org/wiki/Love_lock" target="_blank">Love locks</a> are a popular and powerful way to signify an unbreakable love and capture it forever. Unfortunately, the most popular sites around the world get their love locks taken down all the time due to hazards or other miscellaneous reasons. <br/><br/> Crypto Love Locks takes the love lock and puts it on the <a href="https://en.wikipedia.org/wiki/Ethereum" target="_blank">Ethereum blockchain</a> so they can never be taken down again.<br/><br/>Choose a spot, engrave your message and let your memory live on forever.</div>
            </div>
        </div>
      </Portal>
    )
  }
}

export default About;
