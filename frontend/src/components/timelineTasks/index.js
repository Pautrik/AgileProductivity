import "./index.css";
import React from "react";

import { dayDistance, stringToDate } from "../../helpers/date"


class TimelineTasks extends React.Component {
  render() {
    const { tasks } = this.props;

    const heightSplit = Math.max(...tasks.filter(t => t !== undefined && t.heightSplit !== undefined).map(t => t.heightSplit), tasks.length)

    return (
      <div className="timeline-tasks">
        {tasks.map(task => {
          // const stylePrep = { width: `calc(100% * ${taskLength})`, height: `calc(100% / ${tasks.length})`};
          const stylePrep = { height: `calc(100% / ${heightSplit})`};
          if(task !== undefined) {
            const taskWidth = dayDistance(stringToDate(task.date), stringToDate(task.endDate));
            stylePrep.width = `calc(100% * ${taskWidth + 1})`;
          }
          else {
            stylePrep.visibility = "hidden";
          }

          return (
            <div className="timeline-task" style={stylePrep}>
              {task && <p>{task.text}</p>}
            </div>
          )
        })}
      </div>
    );
  }
}

export default TimelineTasks;