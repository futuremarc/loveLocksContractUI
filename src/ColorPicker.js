import React, { Component } from 'react';
import { HuePicker } from 'react-color';

class ColorPicker extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    const {onColorPick} = this.props;
    onColorPick(e);
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.messages !== nextProps.messages);
}



  render() {
    return (
      <HuePicker onChangeComplete ={this.onChange} {...this.props}/>
    )
  }
}

export default ColorPicker;
