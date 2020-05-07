import React from "react";
import "./index.css";
import Task from "../tasks";

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.taskTextRef = React.createRef();

    this.onTaskSubmit = this.onTaskSubmit.bind(this);
    this.enterEditMode = this.enterEditMode.bind(this);
  }

  enterEditMode() {
    this.setState({ isEditing: true },
      () => this.taskTextRef.current.focus());
  }

  onTaskSubmit() {
    const text = this.taskTextRef.current.innerText;
    this.props.addTask(text);
    this.setState({ isEditing: false });
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
          <Task deleteTask={() => this.props.deleteTask(x.id)} taskText={x.text} />
        ))}
        {this.state.isEditing
          ? (
            <div className="form-area">
              <div className="text-area" contentEditable ref={this.taskTextRef} placeholder="Enter task text"></div>
              <div className="buttons-container">
                <button onClick={() => this.setState({ isEditing: false })}>Cancel</button>
                <button onClick={this.onTaskSubmit}>Submit</button>
              </div>
            </div>
          )
          : <button onClick={this.enterEditMode} className="add-task-button">+</button>
        }
      </div>
    );
  }
}

export default Day;
