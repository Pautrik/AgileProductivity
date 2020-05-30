import "./index.css";
import React from "react";

class ProjectTask extends React.Component {
  render() {
    const { projectName, onDelete } = this.props;

    return (
      <div className="project-wrapper">
        <div className="project-task"> 
          <button onClick={() => onDelete(projectName)} className="x-button">X</button>
          {projectName}
          <button className="done-button">Done</button>
        </div>
        <div className="project-line">
          
        </div>
      </div>
    );
  }
}

export default ProjectTask;