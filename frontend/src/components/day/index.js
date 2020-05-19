import React from "react";
import "./index.css";
import { DropTarget } from "react-dnd";

import Task from "../tasks";
import { ItemTypes } from "../../helpers/constants";

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
    this.setState({ isEditing: true }, () => this.taskTextRef.current.focus());
  }

  onTaskSubmit() {
    const text = this.taskTextRef.current.innerText;
    this.props.addTask(text);
    this.setState({ isEditing: false });
  }

  render() {
    return this.props.connectDropTarget(
      <div className="day-box">
        <h2>
          {this.props.dayName}
          {this.props.dayDate && this.props.dayName === this.props.todaysDay ? (
            <p style={{color: "red"}}>{this.props.dayDate}</p>
          ) : (
            <p>{this.props.dayDate}</p>
          )}
        </h2>
        {this.props.tasks.map((x) => (
          <Task
            key={`${x.id}`}
            deleteTask={() => this.props.deleteTask(x.id)}
            moveTask={(source, destination) => this.props.moveTask(source, destination)}
            id={x.id}
            taskText={x.text}
            status={x.state}
            timestamp={this.props.timestamp}
            position={x.position}
            changeTaskState={() => this.props.changeTaskState(x.id)}
          />
        ))}
        {this.state.isEditing ? (
          <div className="form-area" style={this.props.hovered ? { marginTop: "80px" } : {}}>
            <div
              className="text-area"
              contentEditable
              ref={this.taskTextRef}
              placeholder="Enter task text"
              onKeyDown={(event) => event.keyCode === 13 && this.onTaskSubmit()}
            ></div>
            <div className="buttons-container">
              <button onClick={() => this.setState({ isEditing: false })}>
                Cancel
              </button>
              <button onClick={this.onTaskSubmit}>Submit</button>
            </div>
          </div>
        ) : (
          <button onClick={this.enterEditMode} className="add-task-button" style={this.props.hovered ? { marginTop: "80px" } : {}}>
            +
          </button>
        )}
      </div>
    );
  }
}

const targetTypes = [ ItemTypes.TASK, ItemTypes.NOTE ];

const dayTarget = {
  drop: (props, monitor, component) => {
    if(monitor.didDrop()) return undefined;
    const source = { item: monitor.getItem(), type: monitor.getItemType() };
    const destination = { item: { timestamp: props.timestamp, position: props.tasks.length }, type: props.timestamp ? ItemTypes.TASK : ItemTypes.NOTE };

    props.moveTask(source, destination);
  }
}

const collectTarget = (connect, monitor) => ({
  hovered: monitor.isOver({ shallow: true }),
  connectDropTarget: connect.dropTarget(),
})

export default DropTarget(targetTypes, dayTarget, collectTarget)(Day);
