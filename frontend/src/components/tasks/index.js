import "./index.css";
import React from "react";

class Task extends React.Component {
  render() {
    const { status, taskText } = this.props;
    let buttonText = "";
    let taskColor = "";
    if (status === 1) {
      buttonText = "Start";
      taskColor = "";
    } else if (status === 2) {
      buttonText = "Done";
      taskColor = "hsl(49, 69%, 73%)";
    } else if (status === 3) {
      buttonText = "Archive";
      taskColor = "hsl(93, 69%, 73%)";
    }

    return (
      <div className="task" style={{ backgroundColor: taskColor }}>
        {status && (
          <button onClick={this.props.deleteTask} className="x-button">
            X
          </button>
        )}
        {taskText}
        {status && <button className="done-button">{buttonText}</button>}
      </div>
    );
  }
}

export default Task;
