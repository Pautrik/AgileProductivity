import React from "react";
import "./index.css";
import ProjectTask from "../projectTasks"
import { httpRequestJson } from "../../helpers/requests";
import TimelineTasks from "../timelineTasks";
import AddTimelineTaskModal from "../addTimelineTaskModal";

import { copyDate, isEqualDates, dateToString } from "../../helpers/date";

const getProjectEndpoint = activeState => `/projects?select=${activeState}`;
const postProjectEndpoint = "/projects?key=value";
const deleteProjectEndpoint = name => `/projects?name=${name}`;
const getTimelineTaskEndpoint = (projects, startDate, endDate) => `/timeline?parameters=${projects.join("&")}&${startDate}&${endDate}`;
const postTimelineTaskEndpoint = "/timeline?key=value";
const deleteTimelineTaskEndpoint = id => `/timeline?id=${id}`;

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

        startDate.setDate(startDate.getDate() - 28);

        this.state = {
            startDate,
            rangeT: 70,
            projectFilter: "any", // "any", "active", "inactive"
            projects: [],
            tasks: [],
            days: [],
            isLoading: false,
            viewingRange: "month",
            inAddMode: false,
            isEditingProject: false,
        }

        this.scrollerRef = React.createRef();
        this.projectTextRef = React.createRef();

        this.dateOffsetFromStart = this.dateOffsetFromStart.bind(this);
        this.getWeekDay = this.getWeekDay.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getMonth = this.getMonth.bind(this);
        this.submitTask = this.submitTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.enterProjectEditMode = this.enterProjectEditMode.bind(this);
        this.onProjectSumbit = this.onProjectSumbit.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
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
            return await httpRequestJson(getProjectEndpoint(projectFilter));
        }
        catch (e) {
            alert("Failed to fetch timeline projects");
        }
    }

    async fetchTasks(projects) {
        try {
            const { startDate, rangeT } = this.state;
            const endDate = copyDate(startDate);
            endDate.setDate(endDate.getDate() + rangeT);
            return await httpRequestJson(getTimelineTaskEndpoint(projects.map(x => x.name), dateToString(startDate), dateToString(endDate)));
        }
        catch (e) {
            alert("Failed to fetch timeline tasks");
        }
    }

    tasksToDays(tasks, projects) {
        const days = [];
        let startedTasks = [];

        for (let i = 0; i < this.state.rangeT; i++) {
            const dayDate = copyDate(this.state.startDate);
            dayDate.setDate(dayDate.getDate() + i);

            const dayTasks = tasks.filter(task => task.date === dateToString(dayDate));

            const orderedDayTasks = projects.map(p => {
                const startedProjectTasks = startedTasks.filter(t => t.project.name === p.name);
                const combinedTasks = [
                    ...startedProjectTasks.map(() => undefined),
                    ...dayTasks.filter(t => t.project.name === p.name)
                ];
                const heightSplit = combinedTasks.length;
                startedProjectTasks.forEach(t => t.heightSplit = t.heightSplit > heightSplit ? t.heightSplit : heightSplit);

                return combinedTasks;
            });

            startedTasks.push(...dayTasks);
            startedTasks = startedTasks.filter(task => task.endDate !== dateToString(dayDate));

            days.push({
                tasks: orderedDayTasks, // Array for each day containing array for all task for a project
                date: copyDate(dayDate),
            });
        }

        return days;
    }

    dateOffsetFromStart(offset) {
        const date = copyDate(this.state.startDate);
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
        const newDate = copyDate(this.state.startDate);
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
        return isEqualDates(date, todayDate);
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

    render() {
        return (
            <>
                <div className="Timeline">
                    <div className="Timeline-header">
                        <div></div>
                        <h1>Timeline</h1>
                        <div className="right-part">
                            <select value={this.state.viewingRange} className="viewingRange" onChange={e => this.setState({ viewingRange: e.target.value })}>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="two-months">2 Months</option>
                                <option value="three-months">3 Months</option>
                            </select>
                            <button onClick={() => this.setState({ inAddMode: true })}>+ Add task</button>
                        </div>
                    </div>
                    <div className="Timeline-holder">
                        <div className="project-day-container">
                            <div className="projects-container">
                                <div className="Project-header"></div>
                                {this.state.projects.map((x) =>
                                    <ProjectTask onDelete={this.deleteProject} projectName={x.name} />
                                )}
                                {this.renderAddProject()}
                            </div>
                            <div ref={this.scrollerRef} className="day-holder" onScroll={this.handleScroll}>
                                {this.state.days.map(day => {
                                    const dayDate = day.date;
                                    const today = new Date();
                                    return (
                                        <div className={`day-Timeline ${this.state.viewingRange}`} {...(this.isFocusedDate(dayDate) ? { id: "key" } : {})}>
                                            <div className="day-header" style={isEqualDates(today, dayDate) ? { color: "red" } : {}}>
                                                {this.getWeekDay(dayDate)} <br />
                                                {this.getMonth(dayDate)} <br />
                                                {dayDate.getDate()}
                                            </div>
                                            {day.tasks.map((tasks, i) => (
                                                <TimelineTasks
                                                    tasks={tasks}
                                                    deleteTask={this.deleteTask} />
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.inAddMode && (
                    <AddTimelineTaskModal
                        projects={this.state.projects}
                        onSubmit={data => {
                            this.submitTask(data);
                            this.setState({ inAddMode: false });
                        }}
                        onClose={() => this.setState({ inAddMode: false })} />
                )}
            </>
        );
    }

    onProjectSumbit() {
        const projectName = this.projectTextRef.current.innerText.trim();

        if(projectName === "")
            return;

        const body = {
            name: projectName,
            active: true,
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }

        httpRequestJson(postProjectEndpoint, requestOptions)
            .then(() => this.fetchTransformDataToState())
            .then(this.setStatePromise({ isEditingProject: false }))
            .catch(() => alert("Failed to create project"));
    }

    enterProjectEditMode() {
        this.setState({ isEditingProject: true }, () => this.projectTextRef.current.focus());
    }

    deleteProject(name) {
        httpRequestJson(deleteProjectEndpoint(name), { method: "DELETE" })
            .then(() => this.fetchTransformDataToState())
            .catch(() => alert("Failed to delete project"));
    }

    renderAddProject() {
        if (this.state.isEditingProject) {
            return (
                <>
                    <div className="form-area">
                        <div
                            className="text-area"
                            contentEditable
                            ref={this.projectTextRef}
                            placeholder="Enter project text"
                            onKeyDown={(event) => {
                                if (event.keyCode === 13)
                                    this.onProjectSumbit()
                                else if (event.keyCode === 27) this.setState({ isEditingProject: false })
                            }}></div>
                        <div className="buttons-container">
                            <button className="submit-button" onClick={this.onProjectSumbit}>&#10148;</button>
                        </div>

                    </div>
                    <div onClick={() => this.setState({ isEditingProject: false })} className="layerClick"></div>
                </>
            )
        }
        else {
            return (
                <button onClick={this.enterProjectEditMode} className="add-task-button" style={this.props.hovered ? { marginTop: "80px" } : {}}>
                    +
                </button>
            )
        }
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

    submitTask(data) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, ...{ state: 1, position: 0 } }),
        };

        httpRequestJson(postTimelineTaskEndpoint, requestOptions)
            .then(() => this.fetchTransformTasksToState())
            .catch(() => alert("Failed to post timeline task"))
    }

    deleteTask(id) {
        httpRequestJson(deleteTimelineTaskEndpoint(id), { method: "DELETE" })
            .then(() => this.fetchProjects())
            .then(projects => this.setStatePromise({ projects }))
            .catch(() => alert("Failed to delete timeline task"))
    }

    setStatePromise = state => new Promise(resolve => this.setState(state, resolve));
}


export default Timeline;