import React from "react";
import "./index.css";

class NumberSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <input
        className="numberSelector"
        type="number"
        value={this.props.value}
        onInput={this.props.handleInput}
        defaultValue={this.props.default}
      />
    );
  }
}

export default NumberSelector;
