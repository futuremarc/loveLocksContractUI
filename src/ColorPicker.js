import React, { Component } from 'react';
import { SliderPicker } from 'react-color';
let form;

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

  componentDidMount(){
    form = document.getElementsByTagName('form')[0];
  }

  onChange(e){
    form.style.background = e.hex;
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.messages !== nextProps.messages);
  }

  render() {
    return (
      <SliderPicker color="#bf4040" onChange={this.onChange} onChangeComplete ={this.onChangeComplete} {...this.props}/>
    )
  }
}

export default ColorPicker;
