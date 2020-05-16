import "./index.css";
import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { ItemTypes } from "../../helpers/constants";

class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHoverTarget: false,
    }
  }

  render() {
    const { status, taskText, deleteTask } = this.props;
    const { isDragging, connectDragSource, connectDropTarget, hovered } = this.props; // DnD injected props

    let taskColor = "";
    if (status === 1) {
      taskColor = "";
    } else if (status === 2) {
      taskColor = "hsl(49, 69%, 73%)";
    } else if (status === 3) {
      taskColor = "hsl(93, 69%, 73%)";
    }

    return connectDropTarget(
      connectDragSource(
      <div>
        {hovered && <div className="hovered"></div>}
        <div className="task" style={{ backgroundColor: taskColor }}>
          {
            <button onClick={deleteTask} className="x-button">
              X
            </button>
          }
          {taskText}
          {status && ( // is a note if no status is found
            <button onClick={this.props.changeTaskState} className="done-button">
              &#10004;
            </button>
          )}
        </div>
      </div>
      )
    );
  }
}

const sourceType = props => props.status ? ItemTypes.TASK : ItemTypes.NOTE;

/* Stuff for DnD */
const taskSource = {
  beginDrag: props => {
    const item = { timestamp: props.timestamp, position: props.position };
    return item;
  },
  endDrag: (props, monitor, component) => {
    if (!monitor.didDrop()) {
      return;
    }

    // When dropped on a compatible target, do something
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    /* Move task in state */
    // CardActions.moveCardToList(item.id, dropResult.listId)
  }
}

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
})

const targetTypes = [ ItemTypes.TASK, ItemTypes.NOTE ];

const taskTarget = {
  drop: (props, monitor, component) => {
    const source = { item: monitor.getItem(), type: monitor.getItemType() };
    const destination = { item: { timestamp: props.timestamp, position: props.position }, type: sourceType(props) }

    props.moveTask(source, destination);
  },
}

const collectTarget = (connect, monitor) => ({
  highlighted: monitor.canDrop(),
  hovered: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
});

export default DragSource(sourceType, taskSource, collectSource)(DropTarget(targetTypes, taskTarget, collectTarget)(Task));
