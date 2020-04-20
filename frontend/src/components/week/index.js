import React from 'react';
import Day from '../day';
import './index.css';

class Week extends React.Component {
    render() {
        return (
            <div className="week-box">
                <div className="week-header">
                    <h1>
                        January 2020
                    </h1>
                </div>
                <div className="days">
                    <Day dayName="Monday"/>
                    <Day dayName="Tuesday"/>
                </div>
            </div>
        )
    }
}

export default Week;