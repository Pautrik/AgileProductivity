import "./index.css";
import React from "react";

class ProjectTask extends React.Component {
  render() {
    return (
      <div className="project-task"> 
        <button className="x-button">X</button>
        {this.props.projectTaskText} hej
        <button className="done-button">Done</button>
      </div>
    );
  }
}

export default ProjectTask;