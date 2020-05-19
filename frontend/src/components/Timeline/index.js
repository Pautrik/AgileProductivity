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
        let rangeT = 56;
        let lowestScroll = 0;
        let highestScroll = 0;
        
        startDate.setDate(startDate.getDate() - 28)

        this.state = {
            startDate,
            rangeT,
            lowestScroll,
            highestScroll
        }

        this.scrollerRef = React.createRef();

        this.getNextDay = this.getNextDay.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
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

    currentDayDisplay(x){
        if (x === 3 ){
            return "current-day-header";
          }
          return "day-header";

       
    }

    goBack(){
        this.state.startDate.setDate(this.state.startDate.getDate() - 7);
        this.state.rangeT = this.state.rangeT + 7; 
    }
    goForward(){
        this.state.rangeT = this.state.rangeT + 7; 
    }

    isKeyDate(x){
        
        let z = this.getNextDay(x);
        z.setMonth(z.getMonth() - 1);
        let y = new Date();
        y.setDate(y.getDate() - 9);
        
        if(z.getMonth() === y.getMonth() && z.getDate() === y.getDate()){

            return true;
        }
        else{
            return false;
        }
        
    }

    handleScroll() {

        console.log("hej")

        let s = (this.scrollerRef.current.offsetLeft)/(document.documentElement.scrollWidth)

        console.log(s)

        if(s < this.state.lowestScroll){

            this.state.lowestScroll = s;
            console.log(this.state.lowestScroll)
            this.goBack();
        }
        else if(s > this.state.lowestScroll){
            
            this.state.highestScroll = s;
            console.log(this.state.highestScroll)
            this.goForward();
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
                        <div ref={this.scrollerRef} className="day-holder" onScroll={this.handleScroll}>
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
        this.scrollerRef.current.scrollLeft = document.getElementById("key").offsetLeft;
        this.state.lowestScroll = (this.scrollerRef.current.offsetLeft)/(document.documentElement.scrollWidth);
        this.state.highestScroll = (this.scrollerRef.current.offsetLeft)/(document.documentElement.scrollWidth);
        console.log(this.state.highestScroll)
        console.log(this.state.lowestScroll)

    }
}

{/* 
    1. scrollbar med overflow för att scrolla fram och tillbaka mellan
    2. sätt konstant bred på alla dagar och räkna positioner efter detta
    3. lägga dag objekt bakom projekt.



*/}

export default Timeline;