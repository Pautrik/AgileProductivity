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

    if(task !== undefined) {
      const taskWidth = dayDistance(stringToDate(task.date), stringToDate(task.endDate));
      stylePrep.width = `calc(100% * ${taskWidth + 1})`;
    }
    else {
      stylePrep.visibility = "hidden";
    }

    console.log(this.props);

    return (
      <div className="timeline-task" style={stylePrep}>
        {task && <p>{task.text}</p>}
        <button onClick={() => this.props.deleteTask(task.id)}>&#128465;</button>
      </div>
    )
  }
}

export default TimelineTasks;