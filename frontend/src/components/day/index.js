import React from "react";
import "./index.css";
import Task from "../tasks";

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="day-box">
        <h2>{this.props.dayName}</h2>
        {this.props.tasks.map((x) => (
          <Task taskText={x.text} />
        ))}
      </div>
    );
  }
}

export default Day;
