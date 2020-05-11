import React from "react";
import "./index.css";
import ProjectTask from "../projectTasks"
import {range} from "../../helpers/array";

const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

class Timeline extends React.Component{
    constructor(props){
        super(props);

        const startDate = new Date();
        const endDate = new Date();
        let rangeT = 42;
        
        startDate.setDate(startDate.getDate() - 21)
        endDate.setDate(endDate.getDate() + 21)


        this.state = {
            startDate,
            endDate,
            rangeT
        }

        this.scrollerRef = React.createRef();

        this.getNextDay = this.getNextDay.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.state.startDate.setDate(this.state.startDate.getDate() - 7);
    }

    getNextDay(x){
        const y = new Date();
        y.setDate(this.state.startDate.getDate() + x);
        return y;
    }

    getWeekDay(x){
        const y = new Date();
        y.setDate(this.state.startDate.getDate() + x);
        return weekDays[y.getDay()];
    }

    goBack(){
        this.state.startDate.setDate(this.state.startDate.getDate() - 7);
        this.state.rangeT = this.state.rangeT + 7; 
    }

    handleScroll(s){

    }

    isKeyDate(x){
        
        let z = this.getNextDay(x);
        let y = new Date();

        console.log(z.getMonth())
        console.log(y.getMonth() + 1)
        console.log(z.getDate())
        

        if(z.getMonth() == (y.getMonth() + 1) && z.getDate() === 1){
            console.log("funkar")
            return true;
        }
        else{
            console.log("funkar ej")
            return false;
        }
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
                            
                        </div>
                        <div ref={this.scrollerRef} className="day-holder">
                            {
                            range(this.state.rangeT).map((x) => (
                                (this.isKeyDate(x))
                                ? <div className="day-Timeline" id="key">{this.getWeekDay(x)} <br></br> {this.getNextDay(x).getDate()}</div>
                                : <div className="day-Timeline">{this.getWeekDay(x)} <br></br> {this.getNextDay(x).getDate()}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.scrollerRef.current.scrollLeft = document.getElementById("key").offsetLeft - 99;
    }
}

{/* 
    1. scrollbar med overflow för att scrolla fram och tillbaka mellan
    2. sätt konstant bred på alla dagar och räkna positioner efter detta
    3. lägga dag objekt bakom projekt.



*/}

export default Timeline;