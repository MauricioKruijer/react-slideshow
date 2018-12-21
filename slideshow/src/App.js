import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SlideShow from './components/layout/SlideShow';
import Upload from './components/upload/Upload';

import Firebase from './components/Firebase/Firebase';
import FirebaseContext from './components/Firebase/Context';
const fb = new Firebase();

class App extends Component {
  render() {
    return (
      <FirebaseContext.Provider value={fb}>
        <BrowserRouter>
          <div className="App">
            <Navbar/>
            <Switch>
              <Route exact path="/" component={SlideShow} />
              <Route path="/upload" component={Upload} />
            </Switch>
          </div>
        </BrowserRouter>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
