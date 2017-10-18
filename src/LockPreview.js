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
      x -= 500; //width of lock
      y += 50;
    }if (mQuadrant == 3){
      y -= 400;
      x += 50;
    }else if (mQuadrant == 4){
      x -= 500;
      y -= 400;
    }else{
      y+=50;
      x+=50;
    }

    const style = {
      top:y + 'px',
      left:x + 'px'
    };

    return (
      <div className="preview-lock" style={style}>
        <div className="big-lock" style={{backgroundColor:currentLock.color}}>
          <div className="preview-lock-body">
            <div className="name-preview">{currentLock.personA}</div><span id="lovers-cross">×</span><div className="name-preview">{currentLock.personB}</div>
            <div className="msg-preview">{currentLock.msg1}{currentLock.msg2}{currentLock.msg3}{currentLock.msg4}</div>
            <div className="preview-bar"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default LockPreview;
