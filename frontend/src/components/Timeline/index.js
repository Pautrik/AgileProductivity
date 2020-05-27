import React from "react";
import "./index.css";
import ProjectTask from "../projectTasks"
import { httpRequestJson } from "../../helpers/requests";
import TimelineTask from "../timelineTasks";

const projectEndpoint = activeState => `/projects?select=${activeState}`;
const timelineTaskEndpoint = (projects, startDate, endDate) => `/timeline?parameters=${projects.join("&")}&${startDate}&${endDate}`;

const DAYS_TO_LOAD = 14;

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

class Timeline extends React.Component {
    constructor(props) {
        super(props);

        const startDate = new Date();
        let rangeT = 56;

        startDate.setDate(startDate.getDate() - 28);

        this.state = {
            startDate,
            rangeT,
            projectFilter: "any", // "any", "active", "inactive"
            projects: [],
            tasks: [],
            days: [],
            isLoading: false,
            viewingRange: "month",
        }

        this.scrollerRef = React.createRef();

        this.dateOffsetFromStart = this.dateOffsetFromStart.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getMonth = this.getMonth.bind(this);
    }

    // Fetches projects and tasks and transforms it to days before setting state
    async fetchTransformDataToState() {
        const { tasks, projects } = await this.fetchProjectsAndTasks();
        const days = this.tasksToDays(tasks, projects);

        await this.setStatePromise({ tasks, projects, days });
    }

    // Fetches tasks and transforms it to days before setting state
    async fetchTransformTasksToState() {
        const { projects } = this.state;
        const tasks = await this.fetchTasks(projects);
        const days = this.tasksToDays(tasks, projects);

        await this.setStatePromise({ tasks, days });
        this.setState({ isLoading: false });
    }

    async fetchProjectsAndTasks() {
        const projects = await this.fetchProjects();
        const tasks = await this.fetchTasks(projects);
        return { projects, tasks };
    }

    async fetchProjects() {
        try {
            const { projectFilter } = this.state;
            return await httpRequestJson(projectEndpoint(projectFilter));
        }
        catch (e) {
            alert("Failed to fetch timeline projects");
        }
    }

    async fetchTasks(projects) {
        try {
            const { startDate, rangeT } = this.state;
            const endDate = this.copyDate(startDate);
            endDate.setDate(endDate.getDate() + rangeT);
            return await httpRequestJson(timelineTaskEndpoint(projects.map(x => x.name), this.dateToString(startDate), this.dateToString(endDate)));
        }
        catch (e) {
            alert("Failed to fetch timeline tasks");
        }
    }

    tasksToDays(tasks, projects) {
        const days = [];
        for (let i = 0; i < this.state.rangeT; i++) {
            const dayDate = this.copyDate(this.state.startDate);
            dayDate.setDate(dayDate.getDate() + i);
            const dayTasks = tasks.filter(task => task.date === this.dateToString(dayDate));
            const orderedDayTasks = projects.map(p => dayTasks.filter(t => t.project.name === p.name));

            days.push({
                tasks: orderedDayTasks, // Array for each day containing array for all task for a project
                date: this.copyDate(dayDate),
            });
        }

        return days;
    }

    dateOffsetFromStart(offset) {
        const date = this.copyDate(this.state.startDate);
        date.setDate(date.getDate() + offset);
        return date;
    }

    getWeekDay(date) {
        return weekDays[date.getDay()];
    }

    getMonth(date) {
        return months[date.getMonth()];
    }

    goBack() {
        const scrollWidth = this.scrollerRef.current.scrollWidth;
        const newDate = this.copyDate(this.state.startDate);
        newDate.setDate(newDate.getDate() - DAYS_TO_LOAD)
        this.setState({ startDate: newDate, rangeT: this.state.rangeT + DAYS_TO_LOAD }, () =>
            this.fetchTransformTasksToState()
                .then(() => {
                    this.scrollerRef.current.scrollLeft += this.scrollerRef.current.scrollWidth - scrollWidth
                }));
    }
    goForward() {
        this.setState({ rangeT: this.state.rangeT + DAYS_TO_LOAD }, () =>
            this.fetchTransformTasksToState());
    }

    isFocusedDate(date) {
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 9);
        return this.isEqualDates(date, todayDate);
    }

    handleScroll() {
        if (this.state.isLoading === false) {
            const scrollLeft = this.scrollerRef.current.scrollLeft;
            const scrollWidth = this.scrollerRef.current.scrollWidth;
            const viewportWidth = this.scrollerRef.current.offsetWidth;

            if (scrollLeft < 500) {
                this.setState({ isLoading: true });
                this.goBack();
            }
            else if (scrollWidth - scrollLeft - viewportWidth < 500) {
                this.setState({ isLoading: true });
                this.goForward();
            }
        }
    }

    stringToDate(str) {
        return new Date(`${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`);
    }

    dateToString(date) {
        return date.toISOString().substr(0, 10).replace(/-/g, "");
    }

    render() {
        return (
            <div className="Timeline">
                <div className="Timeline-header">
                    <div></div>
                    <h1>Timeline</h1>
                    <div>
                        <select className="viewingRange" onChange={e => this.setState({ viewingRange: e.target.value })}>
                            <option value="week">Week</option>
                            <option selected value="month">Month</option>
                            <option value="two-months">2 Months</option>
                            <option value="three-months">3 Months</option>
                        </select>
                    </div>
                </div>
                <div className="Timeline-holder">
                    <div className="project-day-container">
                        <div className="projects-container">
                            <div className="Project-header">

                            </div>
                            {this.state.projects.map((x) =>
                                <ProjectTask
                                    projectTaskText={x.name}
                                />
                            )}
                        </div>
                        <div ref={this.scrollerRef} className="day-holder" onScroll={this.handleScroll}>
                            {this.state.days.map(day => {
                                const dayDate = day.date;
                                const today = new Date();
                                return (
                                    <div className={`day-Timeline ${this.state.viewingRange}`} {...(this.isFocusedDate(dayDate) ? { id: "key" } : {})}>
                                        <div className="day-header" style={this.isEqualDates(today, dayDate) ? { color: "red" } : {}}>
                                            {this.getWeekDay(dayDate)} <br />
                                            {this.getMonth(dayDate)} <br />
                                            {dayDate.getDate()}
                                        </div>
                                        {day.tasks.map((tasks, i) => (
                                            <TimelineTask
                                                /* nrDays={task && this.dayDistance(this.stringToDate(task.date), this.stringToDate(task.endDate))}
                                                text={task && task.text} */
                                                tasks={tasks} />
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.fetchTransformDataToState()
            .then(() => {
                const focusedDayComponent = this.scrollerRef.current.querySelector("#key");
                if (focusedDayComponent) {
                    this.scrollerRef.current.scrollLeft = focusedDayComponent.offsetLeft;
                }
            });
    }

    setStatePromise = state => new Promise(resolve => this.setState(state, resolve));
    copyDate = date => new Date(date.getTime());
    isEqualDates = (firstDate, secondDate) => this.dateToString(firstDate) === this.dateToString(secondDate);


}


export default Timeline;