import "./index.css";
import React from "react";

class Task extends React.Component {
  render() {
    const { status, taskText } = this.props;
    let buttonText = "";
    let taskColor = "";
    let doneButtonColor = "";
    if (status === 1) {
      buttonText = "To do";
      taskColor = "";
      doneButtonColor = "";
    } else if (status === 2) {
      buttonText = "Completed";
      taskColor = "hsl(120, 100%, 85%)";
      doneButtonColor = "hsl(120, 60%, 50%)";
    } else if (status === 3) {
      buttonText = "Archived";
      taskColor = "hsl(0, 0%, 95%)";
      doneButtonColor = "hsl(0, 0%, 70%)";
    }

    return (
      <div className="task" style={{ backgroundColor: taskColor }}>
        {(
          <button onClick={this.props.deleteTask} className="x-button">
            X
          </button>
        )}
        {taskText}
        {status && <button className="done-button" style={{ backgroundColor: doneButtonColor }}>{buttonText}</button>}
      </div>
    );
  }
}

export default Task;
