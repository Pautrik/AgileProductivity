import "./index.css";
import React from "react";


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
            const taskWidth = this.dayDistance(this.stringToDate(task.date), this.stringToDate(task.endDate));
            stylePrep.width = `calc(100% * ${taskWidth + 1})`;
          }
          else {
            stylePrep.visibility = "hidden";
          }

          return <div className="timeline-task" style={stylePrep}>{task && task.text}</div>
        })}
      </div>
    );
  }

  dayDistance = (firstDate, secondDate) => Math.round(Math.abs(firstDate - secondDate) / (1000 * 60 * 60 * 24));
  stringToDate(str) {
    return new Date(`${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`);
  }
}

export default TimelineTasks;