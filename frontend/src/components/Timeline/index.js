import React from "react";
import "./index.css";

const currentDate = new Date();

class Timeline extends React.Component{
    constructor(props){
        super(props);

    }


    incDate(){
        const date = new Date();
        date.setDate(date.getDate() + 1);

    }

    decDate(){
        const date = new Date();
        date.setDate(date.getDate() + 1);

    }


    render(){
        return(

            <div className="Timeline">
                <div className="Timeline-header">
                    <h1>Timeline</h1>
                </div>
                <div className="day-holder">
                    <div className="day-Timeline">1</div>
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