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
          {this.props.isToday ? (
            <p style={{ color: "red" }}>{this.props.dayDate}</p>
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
          <>
            <div className="form-area" style={this.props.hovered ? { marginTop: "80px" } : {}}>
              <div
                className="text-area"
                contentEditable
                ref={this.taskTextRef}
                placeholder="Enter task text"
                onKeyDown={(event) => {
                  if (event.keyCode === 13)
                    this.onTaskSubmit()
                  else if (event.keyCode === 27) this.setState({ isEditing: false })
                }}


              ></div>
              <div className="buttons-container">
                <button className="submit-button" onClick={this.onTaskSubmit}>&#10148;</button>
              </div>

            </div>
            <div onClick={() => this.setState({ isEditing: false })} className="layerClick"></div>
          </>
        ) : (
            <button onClick={this.enterEditMode} className="add-task-button" style={this.props.hovered ? { marginTop: "80px" } : {}}>
              +
            </button>
          )
        }
      </div>
    );
  }
}

const targetTypes = [ItemTypes.TASK, ItemTypes.NOTE];

const dayTarget = {
  drop: (props, monitor, component) => {
    if (monitor.didDrop()) return undefined;

    const type = props.timestamp ? ItemTypes.TASK : ItemTypes.NOTE;

    let destinationPos = props.tasks.length;
    if (type === monitor.getItemType()) {
      if ((type === ItemTypes.TASK && monitor.getItem().timestamp === props.timestamp) || type === ItemTypes.NOTE) {
        destinationPos--;
      }
    }

    const source = { item: monitor.getItem(), type: monitor.getItemType() };
    const destination = { item: { timestamp: props.timestamp, position: destinationPos }, type };

    props.moveTask(source, destination);
  }
}

const collectTarget = (connect, monitor) => ({
  hovered: monitor.isOver({ shallow: true }),
  connectDropTarget: connect.dropTarget(),
})

export default DropTarget(targetTypes, dayTarget, collectTarget)(Day);
