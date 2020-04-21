import React from "react";
import Day from "../day";
import "./index.css";

const weekData = JSON.parse(`{
	"days":[
		{
			"date": "20200416",
			"tasks": [
				{
					"text": "Do this 1.0",
					"state": 1
				},
				{
					"text": "Do this 1.1",
					"state": 1
				},
				{
					"text": "Do this 1.2",
					"state": 1
				}

			]
		},
		{

			"date": "20200417",
			"tasks": [
				{
					"text": "Do this 2",
					"state": 1
				}
			]
		},
		{
			"date": "20200418",
			"tasks": [
				{
					"text": "Do this 3",
					"state": 1
				}
			]
		},
		{
			"date": "20200419",
			"tasks": [
				{
					"text": "Do this 4",
					"state": 1
				}
			]
		},
		{
			"date": "20200420",
			"tasks": [
				{
					"text": "Do this 5",
					"state": 1
				}
			]
		},
		{
			"date": "20200421",
			"tasks": [
				{
					"text": "Do this 6",
					"state": 1
				}
			]
		},
		{
			"date": "20200422",
			"tasks": [
				{
					"text": "Do this 7",
					"state": 1
				}
			]
		}	
	]
}`);

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
  render() {
    return (
      <div className="week-view">
        <div className="week">
          <div className="week-header">
            <h1>January 2020</h1>
          </div>
          <div className="days">
            {weekDays.map((x, i) => (
              <Day dayName={x} tasks={weekData.days[i].tasks} />
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
