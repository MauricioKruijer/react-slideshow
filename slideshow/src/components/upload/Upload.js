import React, { Component } from 'react';
import FirebaseContext from "../Firebase/Context";

class Upload extends Component {
  componentDidMount() {
    this.props.firebase.db.ref(`slides`).push({
      type: 'image',
      url: 'nu met push'
    });
  }

  render() {
    return (
      <div>
        UPLOAD PAGEEE
      </div>
    );
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <Upload firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
