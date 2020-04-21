import "./index.css";
import React from "react";

class Task extends React.Component {
  render() {
    return <div className="task">{this.props.taskText} </div>;
  }
}

export default Task;
