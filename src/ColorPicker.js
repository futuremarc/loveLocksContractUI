import React, { Component } from 'react';
import { SliderPicker } from 'react-color';
import $ from 'jquery';

class ColorPicker extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeComplete = this.onChangeComplete.bind(this);
  }

  onChangeComplete(e){
    const {onColorPick} = this.props;
    onColorPick(e);
  }

  onChange(e){
    $('form').css('background',e.hex);
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.messages !== nextProps.messages);
}



  render() {
    return (
      <SliderPicker color="#bf5240" onChange={this.onChange} onChangeComplete ={this.onChangeComplete} {...this.props}/>
    )
  }
}

export default ColorPicker;
