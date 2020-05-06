import React from "react";
import Day from "../day";
import "./index.css";
import { httpRequestJson } from "../../helpers/requests";
const weekEndpoint = "/week.json";


class Timeline extends React.Component{
    constructor(props){
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
        httpRequestJson(weekEndpoint)
          .then(data => this.setState(data))
          .catch(err => {
            alert(err.message);
            console.error(err);
          });
    
      }

    render(){
        return(

            <div className="Timeline">
                <div className="Timeline-header">
                    <h1>Timeline</h1>
                </div>
                <div classname="day-holder">
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                    <Day dayName={"1"} tasks={[]} />
                </div>
            </div>
        );
    }
 
}

{/* 
    1. scrollbar med overflow för att scrolla fram och tillbaka mellan
    2. sätt konstant bred på alla dagar och räkna positioner efter detta
    3. lägga dag objekt bakom projekt.



*/}

export default Timeline;