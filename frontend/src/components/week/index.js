import React from "react";
import Day from "../day";
import "./index.css";
import Button from "../button";
import Arrow from "../arrow";
import NumberSelector2 from "../numberSelector2";
import { httpRequestJson } from "../../helpers/requests";
const weekEndpoint = (year, week) => `http://localhost:8000?week=${year}${week}`;
// const weekEndpoint = _ => "/week.json";
const notesEndpoint = "/notes.json";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

class Week extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [
        { tasks: [] },
        { tasks: [] },
        { tasks: [] },
        { tasks: [] },
        { tasks: [] },
        { tasks: [] },
        { tasks: [] },
      ],

      notes: [],

      chosenWeek: this.weekNum(),
    };

    this.postTask = this.postTask.bind(this);
  }

  componentDidMount() {
    // httpRequestJson(weekEndpoint)
    this.fetchWeekToState(2020, this.state.chosenWeek);

    /* httpRequestJson(notesEndpoint)
      .then(data => this.setState(data))
      .catch(err => {
        alert(err.message);
        console.error(err);
      }); */
  }

  fetchWeekToState(year, week) {
    httpRequestJson(weekEndpoint(year,week))
      .then(data => this.setState({ days: data[0] }))
      .catch(err => {
        alert(err.message);
        console.error(err);
      });
  }

  weekNum() {
    let yr2 = new Date();
    let yr = new Date().getFullYear();
    let tdt = new Date("January 4," + yr + " " + "01:15:00");
    return (
      1 +
      Math.round(
        ((yr2.getTime() - tdt.getTime()) / 86400000 -
          3 +
          ((tdt.getDay() + 6) % 7)) /
          7
      )
    );
  }

  CurrentWeek = () => {
    this.setState({
      chosenWeek: this.weekNum(),
    });
  };

  clickUp = () => {
    const newWeek = this.state.chosenWeek + 1;
    this.fetchWeekToState(2020, newWeek);
    this.setState({
      chosenWeek: newWeek,
    });
  };

  clickDown = () => {
    const newWeek = this.state.chosenWeek - 1;
    this.fetchWeekToState(2020, newWeek);
    this.setState({
      chosenWeek: newWeek,
    });
  };

  currentWeekDisplay() {
    if (this.state.chosenWeek === this.weekNum()) {
      return "showCurrentWeek";
    }
    return "notCurrentWeek";
  }

  postTask(bodyPayload) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    }

    httpRequestJson(`http://localhost:8000?week=${bodyPayload.date}`, requestOptions)
      .catch(() => alert("Failed to create post"));
  }

  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <span>
              <div className={this.currentWeekDisplay()}>
                <NumberSelector2
                  handleClickUp={this.clickUp}
                  handleClickDown={this.clickDown}
                  value={this.state.chosenWeek}
                />
              </div>
            </span>
            <h1>January 2020</h1>
            <Button handleClick={this.CurrentWeek}>Current week</Button>
          </div>
          <div className="days">
            {weekDays.map((x, i) => {
              const { tasks, date } = this.state.days[i];
              return (<Day
                dayName={x}
                tasks={tasks}
                addTask={text => {
                  const newTask = {
                    text,
                    date,
                    state: 1,
                    position: tasks.length
                  };
                  this.postTask(newTask);
                  
                  // Ensures no modification of the state object without setState
                  const daysCopy = [...this.state.days];
                  daysCopy[i] = { ...daysCopy[i] };
                  daysCopy[i].tasks = [...daysCopy[i].tasks];
                  daysCopy[i].tasks.push(newTask);

                  this.setState({ days: daysCopy});
                }} />)
            })}
            <button onClick={this.clickDown} className="previous-week">
              <Arrow direction="left" />
            </button>
            <button onClick={this.clickUp} className="next-week">
              <Arrow direction="right" />
            </button>
          </div>
        </div>
        <div className="note-container">
          <Day dayName="Notes" tasks={this.state.notes} />
        </div>
      </div>
    );
  }
}

export default Week;
