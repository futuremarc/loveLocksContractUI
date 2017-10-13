import React, { Component } from 'react';

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.onCloseClick = this.onCloseClick.bind(this);

  }


  onCloseClick(e){
    console.log('close form')
    const {closeForm} = this.props;
    closeForm();
  }

  componentWillMount(){}
  componentDidMount(){}
  render(){

    return(
      <div>
        <form id="form">
          <a href="#" onClick={this.onCloseClick} id="close-modal"><span>×</span></a>
          <input id="personA"></input>
          <input id="personB"></input>
          <textarea id="message"></textarea>
          <input id="xPos"></input>
          <input id="yPos"></input>
          <input type="submit" id="submit"></input>
        </form>
      </div>
    )
  }

}

export default Form;
