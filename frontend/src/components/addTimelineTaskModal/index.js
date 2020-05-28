import React from "react";
import "./index.css";

import DatePicker, { registerLocale } from "react-datepicker";
import sv from "date-fns/locale/sv";
import "react-datepicker/dist/react-datepicker.css";

import { dateToString } from "../../helpers/date";

class AddTimelineTaskModal extends React.Component {
    constructor(props) {
        super(props);

        registerLocale("sv", sv);
        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1)

        this.state = {
            selectedProject: props.projects[0].name,
            startDate,
            endDate,
            taskText: "",
        };

        this.submitTask = this.submitTask.bind(this);
    }

    render() {
        return (
            <div className="modal" onClick={e => {
                if(e.target === e.currentTarget) // Prevents firing onClick from child elements
                    this.props.onClose();
            }}>
                <div className="add-task-modal">
                    <h1 className="modal-title">Add Task</h1>
                    <div className="field-columns">
                        <div className="field-titles">
                            <p className="field-row">Project</p>
                            <p className="field-row">Start date</p>
                            <p className="field-row">End date</p>
                            <p className="field-row">Task text</p>
                        </div>
                        <div className="field-inputs">
                            <div className="field-row">
                                <select value={this.state.selectedProject} className="project-selector" onChange={e => this.setState({ selectedProject: e.target.value })}>
                                    {this.props.projects.map(x => <option value={x.name}>{x.name}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={date => this.setState({ startDate: date })}
                                    locale="sv"
                                    dateFormat="dd/MM/yyyy"
                                    />
                            </div>
                            <div className="field-row">
                                <DatePicker
                                    selected={this.state.endDate}
                                    onChange={date => this.setState({ endDate: date })}
                                    locale="sv"
                                    dateFormat="dd/MM/yyyy"
                                    />
                            </div>
                            <div className="field-row">
                                <input
                                    type="text"
                                    placeholder="Enter task text"
                                    value={this.state.taskText}
                                    onChange={e => this.setState({ taskText: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <button className="modal-submit-button" onClick={this.submitTask}>Submit</button>
                </div>
            </div>
        )
    }

    submitTask() {
        const { startDate, endDate, selectedProject, taskText } = this.state;

        const result = {
            date: dateToString(startDate),
            endDate: dateToString(endDate),
            project: this.props.projects.find(p => p.name === selectedProject),
            text: taskText,
        }

        this.props.onSubmit(result);
    }
}

export default AddTimelineTaskModal;