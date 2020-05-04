import React from "react";
import "./index.css";

class NumberSelector2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="numberSelector2">
        <span>Week</span>
        <div className="numberSelectorBox">{this.props.value}</div>
        <div className="buttonBox">
          <button onClick={this.props.handleClickUp} className="buttonStyle">
            Next
          </button>
          <button onClick={this.props.handleClickDown} className="buttonStyle">
            Previous
          </button>
        </div>
      </div>
    );
  }
}

export default NumberSelector2;
