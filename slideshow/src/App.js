import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <h1>Photo Video Slideshow!</h1>
          <Navbar/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
