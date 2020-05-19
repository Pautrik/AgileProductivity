import React from "react";
import "./index.css";
import ProjectTask from "../projectTasks"
import {range} from "../../helpers/array";

const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

class Timeline extends React.Component{
    constructor(props){
        super(props);

        this.currentDate = new Date();
        this.getNextDay = this.getNextDay.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.currentDate.setDate(this.currentDate.getDate() - 3);
    }


    incDate(){
        return (this.currentDate.setDate(this.currentDate.getDate() + 1));

    }

    decDate(){
       return( this.currentDate.setDate(this.currentDate.getDate() - 1));

    }

    getNextDay(x){
        const y = new Date();
        y.setDate(this.currentDate.getDate() + x);
        return y.getDate();
    }

    getWeekDay(x){
        const y = new Date();
        y.setDate(this.currentDate.getDate() + x -1);
        console.log(y.getDay())
        return weekDays[y.getDay()];
    }

    currentDayDisplay(x){
        if (x === 3 ){
            return "current-day-header";
          }
          return "day-header";
    }



    render(){
        return(

            <div className="Timeline">
                <div className="Timeline-header">
                    <h1>Timeline</h1>
                </div>
                <div className="Timeline-holder">
                    <div className="project-day-container">
                        <div className="projects-container"> 
                            <div className="Project-header">
                                
                            </div>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>
                            <ProjectTask > </ProjectTask>

                        </div>
                        <div className="day-holder">
                        {range(50).map((x) => (
                        <div className="day-Timeline">
                            <h2 className={this.currentDayDisplay(x)}>{this.getWeekDay(x)} <br></br> {this.getNextDay(x)}</h2>
                        </div>
                        ))}
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
 
}

{/* 
    1. scrollbar med overflow för att scrolla fram och tillbaka mellan
    2. sätt konstant bred på alla dagar och räkna positioner efter detta
    3. lägga dag objekt bakom projekt.



*/}

export default Timeline;