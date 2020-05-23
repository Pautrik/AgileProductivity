import "./index.css";
import React from "react";


class TimelineTasks extends React.Component {
  render() {
    const { text, nrDays } = this.props;
    return (
      <div className="timeline-task" style={{ width: `calc(100% * ${nrDays})` }}>
          {text}
      </div>
    );
  }
}

export default TimelineTasks;