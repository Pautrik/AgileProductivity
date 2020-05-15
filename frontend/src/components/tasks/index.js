import "./index.css";
import React from "react";

class Task extends React.Component {
  render() {
    const { status, taskText } = this.props;
    let buttonText = "";
    let taskColor = "";
    if (status === 1) {
      taskColor = "";
    } else if (status === 2) {
      taskColor = "hsl(49, 69%, 73%)";
    } else if (status === 3) {
      taskColor = "hsl(93, 69%, 73%)";
    }

    return (
      <div className="task" style={{ backgroundColor: taskColor }}>
        {
          <button onClick={this.props.deleteTask} className="x-button">
            X
          </button>
        }
        {taskText}
        {status && (
          <button onClick={this.props.changeTaskState} className="done-button">
            &#10004;
          </button>
        )}
      </div>
    );
  }
}

export default Task;
