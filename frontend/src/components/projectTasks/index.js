import "./index.css";
import React from "react";

class ProjectTask extends React.Component {
  render() {
    const { projectName, active, onDelete, onToggleActive } = this.props;

    return (
      <div className="project-wrapper">
        <div className="project-task" style={{ backgroundColor: active ? "var(--project-green)" : "rgb(40,40,40)" }}>
          <button onClick={() => onDelete(projectName)} className="x-button">X</button>
          {projectName}
          <button onClick={onToggleActive} className="done-button">
            {active ? "Set inactive" : "Set active"}
          </button>
        </div>
        <div className="project-line">

        </div>
      </div>
    );
  }
}

export default ProjectTask;