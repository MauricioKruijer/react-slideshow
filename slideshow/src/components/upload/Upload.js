import React, { Component } from 'react';
import FirebaseContext from "../Firebase/Context";

class Upload extends Component {
  componentDidMount() {
    const newPostKey = this.props.firebase.db.ref().child('slides').push().key;

    this.props.firebase.db.ref(`slides/${newPostKey}`).set({
      type: 'image',
      url: 'jemoeder'
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
