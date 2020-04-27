import "./index.css";
import React from "react";
import Button from "../button";

class Task extends React.Component {
  render() {
    return <div className="task">
        <button className="x-button">X</button>
        {this.props.taskText}
        <button className="done-button">Done</button>
    </div>;
  }
}

export default Task;
