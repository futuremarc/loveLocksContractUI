import React, { Component } from 'react';

class LockPreview extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  render() {

    let {x,y} = this.props.xy;
    const {currentLock, mQuadrant} = this.props;

    if (mQuadrant == 2){
      x -= 295; //width of lock
      y += 15;
    }if (mQuadrant == 3){
      y -= 225;
      x += 25;
    }else if (mQuadrant == 4){
      x -= 265;
      y -= 215;
    }else{
      y+=20;
      x+=20;
    }

    const style = {
      top:y + 'px',
      left:x + 'px'
    };

    return (
      <div className="preview-lock" style={style}>
        <div className="lock" style={{backgroundColor:currentLock.color}}>
          <div className="preview-lock-body">
            <div className="name-preview">{currentLock.personA}</div><span id="lovers-cross">×</span><div className="name-preview">{currentLock.personB}</div>
            <div className="msg-preview-container"><div className="msg-preview">{currentLock.msg1}{currentLock.msg2}{currentLock.msg3}{currentLock.msg4}</div></div>
            <div className="preview-bar"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default LockPreview;
