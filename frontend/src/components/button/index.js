import React from "react";
import "./index.css";

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <button onClick={this.props.handleClick} className="button">
        {this.props.children}
      </button>
    );
  }
}

export default Button;
