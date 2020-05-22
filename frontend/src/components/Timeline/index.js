import React from "react";
import "./index.css";
import ProjectTask from "../projectTasks"
import {range} from "../../helpers/array";
import { httpRequestJson } from "../../helpers/requests";
import day from "../day";

const projectEndpoint = activeState => `/projects?select=${activeState}`;
const timelineTaskEndpoint = (projects, startDate, endDate) => `/timeline?parameters=${projects.join("&")}&${startDate}&${endDate}`;

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
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  

class Timeline extends React.Component{
    constructor(props){
        super(props);

        const startDate = new Date();
        let rangeT = 56;
        
        startDate.setDate(startDate.getDate() - 28)

        this.state = {
            startDate,
            rangeT,
            projectState: 0,
            projects: [],
            tasks: [],
            days: [],
            isLoading: false,
        }

        this.scrollerRef = React.createRef();

        this.getNextDay = this.getNextDay.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getMonth = this.getMonth.bind(this);
    }

    fetchProjectsAndTasksToState() {
        return new Promise((resolve, reject) => {
            this.setState({isLoading: true});
            const projectStates = ["any", "active", "inactive"];
            httpRequestJson(projectEndpoint(projectStates[this.state.projectState]))
                .then(projects => {
                    httpRequestJson(timelineTaskEndpoint(projects.map(x => x.name), this.dateToString(this.state.startDate), "20201011"))
                    .then(tasks => {
                        const days = this.tasksToDays(tasks, projects);
                        this.setState({ isLoading: false, tasks, projects, days }, () => resolve());
                    });
                });
        })
    }

    tasksToDays(tasks, projects) {
        const days = [];
        for(let i = 0; i < this.state.rangeT; i++){
            const dayDate = new Date();
            dayDate.setDate(this.state.startDate.getDate() + i);
            days.push({
                date: dayDate,
                tasks: [],
            });
        }

        for(let day of days) {
            day.tasks = tasks.filter(task =>
                task.date === this.dateToString(day.date));
        }

        return days;
    }

    getNextDay(x){
        const y = new Date();
        y.setDate(this.state.startDate.getDate() + x);
        return y;
    }

    getWeekDay(x){
        const y = this.stringToDate(this.dateToString(this.state.startDate));
        y.setDate(this.state.startDate.getDate() + x);
        return weekDays[y.getDay()];
    }

    getMonth(x) {
        const y = this.stringToDate(this.dateToString(this.state.startDate));
        y.setDate(y.getDate() + x);
        return months[y.getMonth() - 1];
    }

    goBack(){
        const scrollWidth = this.scrollerRef.current.scrollWidth;
        const newDate = this.stringToDate(this.dateToString(this.state.startDate));
        newDate.setDate(newDate.getDate() - 7)
        this.setState({startDate: newDate, rangeT: this.state.rangeT + 7}, () =>
            this.fetchProjectsAndTasksToState()
                .then(() => this.scrollerRef.current.scrollLeft += this.scrollerRef.current.scrollWidth - scrollWidth)
        )
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

        if(this.state.isLoading === false){
            
            const s = this.scrollerRef.current.scrollLeft;

            if(s < 500){
                this.goBack();
            }
            else if(this.scrollerRef.current.scrollWidth - s - this.scrollerRef.current.offsetWidth < 1000){
                this.goForward();
            }
            this.state.isLoading = false;
        }
    }

    stringToDate(str) {
        return new Date(`${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`);
    }

    dateToString(date) {
        return date.toISOString().substr(0, 10).replace(/\-/g, "");
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
                            this.state.days.map((x, i) => (
                                (this.isKeyDate(i))
                                ? <div className="day-Timeline" id="key">
                                    {this.getWeekDay(i)} <br></br> 
                                    {this.getMonth(i)} <br></br> 
                                    {this.getNextDay(i).getDate()}
                                    <div className="task-holder">
                                        {
                                            
                                        }
                                    </div>
                                </div>
                                : <div className="day-Timeline">
                                    {this.getWeekDay(i)} <br></br> 
                                    {this.getMonth(i)} <br></br> 
                                    {this.getNextDay(i).getDate()}
                                </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        //this.scrollerRef.current.scrollLeft = document.getElementById("key").offsetLeft;
        this.fetchProjectsAndTasksToState();
    }
}


export default Timeline;