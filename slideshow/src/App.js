import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SlideShow from './components/layout/SlideShow';
import Upload from './components/upload/Upload';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path="/" component={SlideShow} />
            <Route path="/upload" component={Upload} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
