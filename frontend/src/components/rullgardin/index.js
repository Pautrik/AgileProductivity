import React from "react";
import "./index.css";

class Rullgardin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <select className="rullgardin" onChange={this.props.onChange}>
        {this.props.items.map((x, i) => (
          <option value={i}>{x}</option>
        ))}
      </select>
    );
  }
}

export default Rullgardin;
