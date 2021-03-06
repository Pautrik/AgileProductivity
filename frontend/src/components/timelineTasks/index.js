import "./index.css";
import React from "react";

import { dayDistance, stringToDate } from "../../helpers/date"


class TimelineTasks extends React.Component {
  render() {
    const { tasks } = this.props;

    const heightSplit = Math.max(...tasks.filter(t => t !== undefined && t.heightSplit !== undefined).map(t => t.heightSplit), tasks.length)

    return (
      <div className="timeline-tasks">
        {tasks.map(t => this.renderTask(heightSplit, t))}
      </div>
    );
  }

  renderTask(heightSplit, task) {
    const stylePrep = { height: `calc(100% / ${heightSplit})` };

    if (task !== undefined) {
      const taskWidth = dayDistance(stringToDate(task.date), stringToDate(task.endDate));
      stylePrep.width = `calc((${taskWidth + 1} * (100% + 2px)) - 2px)`; /* Accounts for day borders */
    }
    else {
      stylePrep.visibility = "hidden";
    }

    return (
      <div className="timeline-task" style={stylePrep}>
        {task && <p>{task.text}</p>}
        <button className="delete-timeline-task" onClick={() => this.props.deleteTask(task.id)}>&#x292B;</button>
      </div>
    )
  }
}

export default TimelineTasks;
