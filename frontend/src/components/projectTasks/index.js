import "./index.css";
import React from "react";

class ProjectTask extends React.Component {
  render() {
    return (
      <div className="project-wrapper">
        <div className="project-task"> 
          <button className="x-button">X</button>
          {this.props.projectTaskText}
          <button className="done-button">Done</button>
        </div>
        <div className="project-line">
          
        </div>
      </div>
    );
  }
}

export default ProjectTask;