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

  const months = [
    "Jan",
    "Feb",
<<<<<<< HEAD
    "Mars",
=======
    "Mar",
>>>>>>> 9806d6b8a8d432f2d3c977a158eb23c98261bfbf
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
<<<<<<< HEAD
    "Dec"
  ];

=======
    "Dec",

  ];

  

>>>>>>> 9806d6b8a8d432f2d3c977a158eb23c98261bfbf
class Timeline extends React.Component{
    constructor(props){
        super(props);

        const startDate = new Date();
        let rangeT = 56;
        
        startDate.setDate(startDate.getDate() - 28)

        this.state = {
            startDate,
            rangeT,
        }

        this.scrollerRef = React.createRef();

        this.getNextDay = this.getNextDay.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getMonth = this.getMonth.bind(this);
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

<<<<<<< HEAD
    getMonth(x){
        const y = new Date();
        y.setDate(this.state.startDate.getDate() + x);
        return months[y.getMonth()];
    }

    currentDayDisplay(x){
        if (x === 3 ){
            return "current-day-header";
          }
          return "day-header";

       
=======
    getMonth(x) {
        const y = new Date();
        y.setDate(this.state.startDate.getDate() + x);
        return months[y.getMonth() - 1];
>>>>>>> 9806d6b8a8d432f2d3c977a158eb23c98261bfbf
    }

    goBack(){
        const scrollWidth = this.scrollerRef.current.scrollWidth;
        const newDate = new Date();
        newDate.setDate(this.state.startDate.getDate() - 7)
        this.setState({startDate: newDate, rangeT: this.state.rangeT + 7}, () =>
            this.scrollerRef.current.scrollLeft += this.scrollerRef.current.scrollWidth - scrollWidth);
    }
    goForward(){
        this.setState({rangeT: this.state.rangeT + 7});
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

        const s = this.scrollerRef.current.scrollLeft;

        if(s < 500){

            this.goBack()
        }
        else if(this.scrollerRef.current.scrollWidth - s - this.scrollerRef.current.offsetWidth < 1000){
            
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
<<<<<<< HEAD
                                ? <div className="day-Timeline" id="key">{this.getWeekDay(x)} <br></br> {this.getNextDay(x).getDate()}</div>
                                : <div className="day-Timeline">{this.getWeekDay(x)} <br></br> {this.getNextDay(x).getMonth} <br></br> {this.getNextDay(x).getDate()}</div>
=======
                                ? <div className="day-Timeline" id="key">{this.getWeekDay(x)} <br></br> {this.getMonth(x)} <br></br> {this.getNextDay(x).getDate()}</div>
                                : <div className="day-Timeline">{this.getWeekDay(x)} <br></br> {this.getMonth(x)} <br></br> {this.getNextDay(x).getDate()}</div>
>>>>>>> 9806d6b8a8d432f2d3c977a158eb23c98261bfbf
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

    }
}


export default Timeline;