import React from 'react';
import './index.css';

class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="day-box">
                <h2>{this.props.dayName}</h2>
            </div>
        )
    }
}

export default Day;