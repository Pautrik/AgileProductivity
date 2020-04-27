import React from "react";
import Day from "../day";
import "./index.css";
import Button from "../button";
import Rullgardin from "../rullgardin";
import NumberSelector from "../numberSelector";
import Arrow from "../arrow";
const weekEndpoint = "/week.json";

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
    };
  }

  componentDidMount() {
    fetch(weekEndpoint, { mode: "cors" })
      .then((res) => res.json())
      .then((data) => this.setState(data));
  }

  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <Rullgardin onChange={console.log} items={["week1", "week2"]} />
            <h1>January 2020</h1>
            <NumberSelector />
            <Button>Current week</Button>
          </div>
          <div className="days">
            {weekDays.map((x, i) => (
              <Day dayName={x} tasks={this.state.days[i].tasks} />
            ))}
            <button className="previous-week"><Arrow direction="left"/></button>
            <button className="next-week"><Arrow direction="right"/></button>
          </div>
        </div>
        <div className="note-container">
          <Day dayName="Notes" tasks={[]} />
        </div>
      </div>
    );
  }
}

export default Week;
