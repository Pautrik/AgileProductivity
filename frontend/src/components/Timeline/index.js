import React from "react";
import DayT from "./dayT";
import "./index.css";


class Timeline extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(

            <div className="Timeline">
                <div className="Timeline-header">
                    <h1>Timeline</h1>
                </div>
                <div classname="day-holder">
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
                <DayT/>
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