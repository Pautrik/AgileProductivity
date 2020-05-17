import React from "react";
import Day from "../day";
import "./index.css";
import Button from "../button";
import Arrow from "../arrow";
import NumberSelector2 from "../numberSelector2";
import { httpRequestJson } from "../../helpers/requests";
const weekEndpoint = (year, week) => `/week?week=${year}${week}`;
const postTaskEndpoint = (date) => `/week?week=${date}`;
const deleteTaskEndpoint = (id) => `/week?week=${id}`;
const getNotesEndpoint = "/notes?key=value";
const postNotesEndpoint = "/notes?key=value";
const deleteNotesEndpoint = (id) => `/notes?id=${id}`;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const yearMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class Week extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [
        { date: "20200416", tasks: [] },
        { date: "20200417", tasks: [] },
        { date: "20200418", tasks: [] },
        { date: "20200419", tasks: [] },
        { date: "20200420", tasks: [] },
        { date: "20200421", tasks: [] },
        { date: "20200422", tasks: [] },
      ],

      notes: [],
      chosenWeek: this.getCurrentWeekNum(),
      year: this.getCurrentYear(),
      ISOWeek: this.getISOWeek(this.getCurrentWeekNum(),this.getCurrentYear()),
    };

    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount() {
    this.fetchWeekToState(2020, this.state.chosenWeek);
    this.fetchNotesToState();
  }

  fetchWeekToState(year, week) {
    httpRequestJson(weekEndpoint(year, week))
      .then((data) => {
        data.forEach((day) =>
          day.tasks.sort((a, b) => a.position - b.position)
        );
        this.setState({ days: data });
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  }

  fetchNotesToState() {
    httpRequestJson(getNotesEndpoint)
      .then((data) => {
        data.sort((a, b) => a.position - b.position);
        this.setState({ notes: data });
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  }

  getCurrentWeekNum() {
    let yr2 = new Date();
    let yr = new Date().getFullYear();
    let tdt = new Date(`January 4, ${yr}   01:15:00`);
    return (
      Math.round(
        ((yr2.getTime() - tdt.getTime()) / 86400000 -
          3 +
          ((tdt.getDay() + 6) % 7)) /
          7
      )
    );
  }

  getCurrentWeekDay() {
    let day = new Date().getDay();
    if (day === 0) {
      return weekDays[6];
    }
    return weekDays[day - 1];
  }

  getCurrentYearMonth() {
    let month = new Date().getMonth();
    return yearMonths[month];
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  SetCurrentWeekState = () => {
    const newWeek = this.getCurrentWeekNum();
    this.fetchWeekToState(2020, newWeek);
    this.setState({
      chosenWeek: newWeek,
    });
  };

  timeBlockDisplay() {
    let d = new Date().getDay();
    let weekDate = this.state.days[d].date;
    let month = parseInt(weekDate.slice(4, 6));
    let year = weekDate.slice(0, 4);
    return yearMonths[month - 1] + " " + year;
  }

  clickUp = () => {
    var newYear = this.state.year;
    const newISO = this.getISOWeek(this.state.chosenWeek + 1,this.state.year);
    const newWeek = this.state.chosenWeek + 1;
    if (newISO == this.weeksInYear(this.state.year)){
      newYear = this.state.year + 1;
    }
    this.fetchWeekToState(2020, newWeek);
    this.setState({
      ISOWeek: newISO,
      year: newYear,
      chosenWeek: newWeek,
    });
  };

  clickDown = () => {
    var newYear = this.state.year;
    const newISO = this.getISOWeek(this.state.chosenWeek - 1,this.state.year);
    const newWeek = this.state.chosenWeek - 1;
    if (newISO == 1){
      newYear = this.state.year - 1;
    }
    this.fetchWeekToState(2020, newWeek);
    this.setState({
      ISOWeek: newISO,
      year: newYear,
      chosenWeek: newWeek,
    });
  };



  addTask(text, date, dayIndex) {
    const newTask = {
      text,
      date,
      state: 1,
      position: this.state.days[dayIndex].tasks.length,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    };

    // Ensures no modification of the state object without setState
    const daysCopy = [...this.state.days];
    daysCopy[dayIndex] = { ...daysCopy[dayIndex] };
    daysCopy[dayIndex].tasks = [...daysCopy[dayIndex].tasks];

    httpRequestJson(postTaskEndpoint(date), requestOptions)
      .then((data) => {
        daysCopy[dayIndex].tasks.push({ ...newTask, id: data[0] });
        this.setState({ days: daysCopy });
      })
      .catch(() => alert("Failed to create task"));
  }

  deleteTask(id, dayIndex) {
    httpRequestJson(deleteTaskEndpoint(id), { method: "DELETE" }).catch(() =>
      alert("Failed to delete task")
    );

    const daysCopy = [...this.state.days];
    daysCopy[dayIndex] = { ...daysCopy[dayIndex] };
    daysCopy[dayIndex].tasks = [...daysCopy[dayIndex].tasks];
    const taskIndex = daysCopy[dayIndex].tasks.findIndex((x) => x.id === id);
    daysCopy[dayIndex].tasks.splice(taskIndex, 1);

    this.correctPositions(daysCopy[dayIndex].tasks);

    this.setState({ days: daysCopy });
  }

  // Removes gaps in position
  correctPositions(arr) {
    arr.sort((a, b) => a.position - b.position);
    arr.forEach((x, i) => (x.position = i));
  }

  addNote(text) {
    const newNote = {
      text,
      position: this.state.notes.length,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };

    httpRequestJson(postNotesEndpoint, requestOptions)
      .then((data) => {
        newNote.id = data[0];
        this.setState({ notes: [...this.state.notes, newNote] });
      })
      .catch(() => alert("Failed to create note"));
  }

  deleteNote(id) {
    httpRequestJson(deleteNotesEndpoint(id), { method: "DELETE" }).catch(() =>
      alert("Failed to delete task")
    );

    const notesCopy = [...this.state.notes];
    const noteIndex = notesCopy.findIndex((x) => x.id === id);
    notesCopy.splice(noteIndex, 1);

    this.correctPositions(notesCopy);

    this.setState({ notes: notesCopy });
  }

  dateToDayConverter = (iDate) => {
    let date = typeof iDate === "string" ? iDate.substr(6, 7) : null;
    return date;
  };

  onChangeTaskState(taskId, i) {
    let daysCopy = this.state.days;
    const state = daysCopy[i].tasks.find((x) => x.id === taskId).state;
    let newState;
    if (state === 3) {
      newState = 1;
    } else {
      newState = state + 1;
    }

    daysCopy[i].tasks.find((x) => x.id === taskId).state = newState;

    this.setState({ days: daysCopy });
  }

  weeksInYear(year){
    const longyears = [2009,2015,2020,2026,2032,2037];
    var weeksInYear
    console.log(year);
    if (longyears.includes(year)){
      return 53;
    }
    return 52;
  }

  getISOWeek(value, year){
    console.log(year);
    if (this.weeksInYear(year) == 53){
      // console.log(weeksInYear);
      if (value%53 == 0){
        return this.weeksInYear(year);
      }
      if (value > 0){
        if (value%53 == 0){
          return this.weeksInYear(year);
        }
        return value%53;
      }
      else{
        return (53) - (Math.abs((value)%53));
      }
    }

    else{
       //console.log(weeksInYear);
       if (value > 0){
         if (value%52 == 0){
           return 52;
         }
         return value%52;
       }
       else{
         return (52) - (Math.abs((value)%52));
       }
    }
  }

  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <span>
              <div>
                <NumberSelector2
                  handleClickUp={this.clickUp}
                  handleClickDown={this.clickDown}
                  value={this.state.chosenWeek}
                  week={this.state.ISOWeek}
                />
              </div>
            </span>
            <h1 Style="color: grey">{this.timeBlockDisplay()}</h1>
            <Button handleClick={this.SetCurrentWeekState}>Current week</Button>
          </div>
          <div className="days">
            {weekDays.map((x, i) => {
              const { tasks, date } = this.state.days[i];
              return (
                <Day
                  todaysDay={this.getCurrentWeekDay()}
                  dayDate={this.dateToDayConverter(this.state.days[i].date)}
                  dayName={x}
                  tasks={tasks}
                  addTask={(text) => this.addTask(text, date, i)}
                  deleteTask={(id) => this.deleteTask(id, i)}
                  changeTaskState={(taskId) =>
                    this.onChangeTaskState(taskId, i)
                  }
                  key={JSON.stringify(this.state.days[i])}
                />
              );
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
          <Day
            dayName="Notes"
            tasks={this.state.notes}
            addTask={this.addNote}
            deleteTask={this.deleteNote}
          />
        </div>
      </div>
    );
  }
}

export default Week;
