import "./index.css";
import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { ItemTypes } from "../../helpers/constants";

class Task extends React.Component {

  render() {
    const { status, taskText, deleteTask } = this.props;
    const { isDragging, connectDragSource, connectDropTarget } = this.props; // DnD injected props
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

    return connectDropTarget(
      connectDragSource(
        <div className="task" style={{ backgroundColor: taskColor }}>
          {(
            <button onClick={deleteTask} className="x-button">
              X
            </button>
          )}
          {taskText}
          {status && <button className="done-button">{buttonText}</button>}
        </div>
      )
    );
  }
}

/* Stuff for DnD */
const taskSource = {
  beginDrag: props => {
    const item = { id: props.id };
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

const targetTypes = [ ItemTypes.TASK ];

const taskTarget = {
  drop: (props, monitor, component) => {
    console.log("Dropped on task");
    console.dir(monitor.getItem());
  },
}

const collectTarget = (connect, monitor) => ({
  highlighted: monitor.canDrop(),
  hovered: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
});

export default DragSource(ItemTypes.TASK, taskSource, collectSource)(DropTarget(targetTypes, taskTarget, collectTarget)(Task));
