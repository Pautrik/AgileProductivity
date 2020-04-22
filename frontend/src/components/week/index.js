import React from "react";
import Day from "../day";
import "./index.css";

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
    }
  }

  componentDidMount() {
    fetch(weekEndpoint, { mode: "cors" })
      .then(res => res.json())
      .then(data => this.setState(data));
  }

  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <h1>January 2020</h1>
          </div>
          <div className="days">
            {weekDays.map((x, i) => (
              <Day dayName={x} tasks={this.state.days[i].tasks} />
            ))}
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
