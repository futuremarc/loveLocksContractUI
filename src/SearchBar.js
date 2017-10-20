import React, { Component } from 'react';
import _ from 'lodash';
let input;

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.messages !== nextProps.messages);
  }

  componentDidMount(){
    input = document.getElementById("search");
  }

  onChange() {
    const {ids, xPoses, yPoses, moveGrid} = this.props;
    const id =  input.value.toLowerCase();

    console.log('SEARCH', id)
    _.map(ids, (value, index) => {

        console.log(value, id, value == id)
        if (value == id){
          console.log('move canvas', xPoses[index], yPoses[index]);
          moveGrid(xPoses[index], yPoses[index]);
        }
    });
  }

  render() {

    return (
      <input type="text" onChange={this.onChange} placeholder="Ethereum Address" id="search"></input>
    )
  }
}

export default SearchBar;
