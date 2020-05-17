import React from "react";
import "./index.css";
import Arrow from "../arrow";

class NumberSelector2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="numberSelector2">
        <span>Week</span>
        <div className={"numberSelectorBox"}>{this.props.week}</div>
        <div className="buttonBox">
          <button onClick={this.props.handleClickUp} className="button">
            <Arrow direction="up" />
          </button>
          <button onClick={this.props.handleClickDown} className="button">
            <Arrow direction="down" />
          </button>
        </div>
      </div>
    );
  }
}

export default NumberSelector2;
