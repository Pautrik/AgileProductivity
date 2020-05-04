import React from "react";
import Day from "../day";
import "./index.css";
import Button from "../button";
import Arrow from "../arrow";
import NumberSelector2 from "../numberSelector2";
import { httpRequestJson } from "../../helpers/requests";
const weekEndpoint = "/week.json";
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
  }

  componentDidMount() {
    httpRequestJson(weekEndpoint)
      .then(data => this.setState(data))
      .catch(err => {
        alert(err.message);
        console.error(err);
      });

      httpRequestJson(notesEndpoint)
      .then(data => this.setState(data))
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
    this.setState({
      chosenWeek: this.state.chosenWeek + 1,
    });
  };

  clickDown = () => {
    this.setState({
      chosenWeek: this.state.chosenWeek - 1,
    });
  };

  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <span>
              <NumberSelector2
                handleClickUp={this.clickUp}
                handleClickDown={this.clickDown}
                value={this.state.chosenWeek}
              />
            </span>
            <h1>January 2020</h1>
            <Button handleClick={this.CurrentWeek}>Current week</Button>
          </div>
          <div className="days">
            {weekDays.map((x, i) => (
              <Day dayName={x} tasks={this.state.days[i].tasks} />
            ))}
            <button className="previous-week">
              <Arrow direction="left" />
            </button>
            <button className="next-week">
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
