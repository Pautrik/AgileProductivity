import React from "react";
import "./index.css";
import {range} from "../../helpers/array";


class Timeline extends React.Component{
    constructor(props){
        super(props);

        this.currentDate = new Date();
        this.getNextDate = this.getNextDay.bind(this);
        this.currentDate.setDate(this.currentDate.getDate() - 3);
    }


    incDate(){
        return (this.currentDate.setDate(this.currentDate.getDate() + 1));

    }

    decDate(){
       return( this.currentDate.setDate(this.currentDate.getDate() - 1));

    }

    getNextDay(x){
        const y = new Date();
        y.setDate(this.currentDate.getDate() + x);
        return y.getDate();
    }

    render(){
        return(

            <div className="Timeline">
                <div className="Timeline-header">
                    <h1>Timeline</h1>
                </div>
                <div className="day-holder">
                    {range(50).map((x) => (
                        <div className="day-Timeline">{this.getNextDay(x)}</div>
                    ))}
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