import "./index.css";
import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { ItemTypes } from "../../helpers/constants";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHoverTarget: false,
    };
  }

  render() {
    const { status, taskText, deleteTask } = this.props;
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      hovered,
    } = this.props; // DnD injected props

    let taskColor = "";
    let doneButtonColor = "";
    if (status === 1) {
      taskColor = "";
      doneButtonColor = "";
    } else if (status === 2) {
      taskColor = "#FFC91A";
      doneButtonColor = "hsl(95, 70%, 90%)";
    } else if (status === 3) {
      taskColor = "#76D384";
      doneButtonColor = "hsl(20, 70%, 90%)";
    }

    return connectDropTarget(
      connectDragSource(
        <div style={isDragging ? { display: "none" } : {}}>
          {hovered && <div className="hovered"></div>}
          <div className="task" style={{ backgroundColor: taskColor }}>
            {
              <button onClick={deleteTask} className="x-button">
                X
              </button>
            }
            {taskText}
            {status && ( // is a note if no status is found
              <button
                onClick={this.props.changeTaskState}
                className="done-button"
              >
                &#10004;
              </button>
            )}
          </div>
        </div>
      )
    );
  }
}

const sourceType = (props) => (props.status ? ItemTypes.TASK : ItemTypes.NOTE);

/* Stuff for DnD */
const taskSource = {
  beginDrag: (props) => {
    const item = { timestamp: props.timestamp, position: props.position };
    return item;
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const targetTypes = [ItemTypes.TASK, ItemTypes.NOTE];

const taskTarget = {
  drop: (props, monitor, component) => {
    if (monitor.didDrop()) return undefined;

    let destinationPos = props.position;
    if (
      sourceType(props) === monitor.getItemType() &&
      props.position > monitor.getItem().position
    ) {
      if (
        (sourceType(props) === ItemTypes.TASK &&
          monitor.getItem().timestamp === props.timestamp) ||
        sourceType(props) === ItemTypes.NOTE
      ) {
        destinationPos--;
      }
    }

    const source = { item: monitor.getItem(), type: monitor.getItemType() };
    const destination = {
      item: { timestamp: props.timestamp, position: destinationPos },
      type: sourceType(props),
    };

    props.moveTask(source, destination);
  },
};

const collectTarget = (connect, monitor) => ({
  highlighted: monitor.canDrop(),
  hovered: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
});

export default DragSource(
  sourceType,
  taskSource,
  collectSource
)(DropTarget(targetTypes, taskTarget, collectTarget)(Task));
