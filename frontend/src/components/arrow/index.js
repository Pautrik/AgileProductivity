import React from "react";
import "./index.css";

class Arrow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <i className={[`arrow arrow-${this.props.direction}`]}></i>;
  }
}

export default Arrow;
