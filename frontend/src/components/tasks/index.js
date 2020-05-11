import "./index.css";
import React from "react";

class Task extends React.Component {
  render() {
    const { status, taskText } = this.props;
    let buttonText = "";
    let taskColor = "";
    if (status === 1) {
      buttonText = "To do";
      taskColor = "";
    } else if (status === 2) {
      buttonText = "Completed";
      taskColor = "hsl(120, 100%, 85%)";
    } else if (status === 3) {
      buttonText = "Archived";
      taskColor = "hsl(0, 0%, 95%)";
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
