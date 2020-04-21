import React from 'react';
import Day from '../day';
import './index.css';

class Week extends React.Component {
    render() {
        return (
            <div className="week-view">
                <div className="week">
                    <div className="week-header">
                        <h1>
                            January 2020
                        </h1>
                    </div>
                    <div className="days">
                        <Day dayName="Monday"/>
                        <Day dayName="Tuesday"/>
                        <Day dayName="Wensday"/>
                        <Day dayName="Thursday"/>
                        <Day dayName="Friday"/>
                        <Day dayName="Saturday"/>
                        <Day dayName="Sunday"/>
                    </div>
                </div>
                <div className="note-container">
                    <Day dayName="Notes" />
                </div>
            </div>
        )
    }
}

export default Week;