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
        <h2>
          {this.props.dayName}
          {this.props.dayDate && this.props.dayName === this.props.todaysDay ? (
            <p Style="color:red">{this.props.dayDate}</p>
          ) : (
            <p>{this.props.dayDate}</p>
          )}
        </h2>

        {this.props.tasks.map((x) => (
          <Task taskText={x.text} />
        ))}
      </div>
    );
  }
}

export default Day;
