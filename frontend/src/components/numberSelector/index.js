import React from "react";
import "./index.css";

class NumberSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <input type="number" />;
  }
}

export default NumberSelector;
