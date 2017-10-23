import React, { Component } from 'react';

class LockPreview extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }



  render() {

    let {x,y} = this.props.xy;
    let {currentLock, mQuadrant} = this.props;
    let nameStyle, crossStyle, msgStyle;

    let {personA, personB, color, msg1, msg2, msg3, msg4, xPos,yPos} = currentLock;


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


    if (personA.length > 5 || personB.length > 5){
      nameStyle = 'name-preview-big';
      crossStyle = 'lovers-cross-big';
    }else{
      nameStyle = 'name-preview'
      crossStyle = 'lovers-cross';
    }

    if (msg1.length + msg2.length + msg3.length + msg4.length > 64){
      msgStyle = 'msg-preview-big';
    }else{
      msgStyle = 'msg-preview';
    }

    return (
      <div className="preview-lock" style={style}>
        <div className="lock" style={{backgroundColor:color}}>
          <div className="preview-lock-body">
            <div className="name-preview-container"><div className={nameStyle}>{personA}</div><div className={crossStyle}>×</div><div className={nameStyle}>{personB}</div></div>
            <div className="msg-preview-container"><div className={msgStyle}>{msg1}{msg2}{msg3}{msg4}</div></div>
            <div className="lock-coords">({xPos},{yPos})</div>
            <div className="preview-bar"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default LockPreview;
