import React from 'react';
import Week from './components/week';
import Timeline from './components/Timeline';
import './App.css';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active: 'FIRST',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.active === 'FIRST')
      this.setState({ active: 'SECOND' });
    else
      this.setState({ active: 'FIRST' });
  }

  render() {
    return (
      <div className="App">
        {this.state.active === 'FIRST' ? (
          <Week />
        ) : this.state.active === 'SECOND' ? (
          <Timeline />
        ) : null}
        <button className="view-togle" onClick={this.handleClick}>Change view</button>
      </div>
    );
  }
}


export default App;
