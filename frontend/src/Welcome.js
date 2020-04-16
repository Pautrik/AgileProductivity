import React from "react";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "J.D"
        };
        this.clicked = this.clicked.bind(this);
    }

    render() {
        return (
            <>
                <button onClick={this.clicked}>Switch name</button>
                <h1>Hello, {this.state.name}</h1>
            </>
        )  
    }

    clicked() {
        this.setState(state => ({ name: state.name === "J.D" ? "Linus" : "J.D" }));
    }
}

export default Welcome;