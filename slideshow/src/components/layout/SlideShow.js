import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'
import FirebaseContext from '../Firebase/Context';

class SlideShow extends Component {
  state = {
    currentSlide: {
      url: '',
      type: ''
    },
    queue: []
  }

  componentDidMount() {
    // deal with firebase socket
    this.props.firebase.slides().once('value', snapshot => {
      const snapshots = snapshot.val();
      const keys = Object.keys(snapshots);
      const last = keys[keys.length-1];

      console.log(snapshots);
      this.props.firebase.slides().orderByKey().startAt(last).on("child_added", function(snapshot) {
        console.log('sonee', snapshot.val())
      });
    })

    // deal with queue
  }

  componentWillUnmount() {
    // unsubscribe from firebase
  }

  render () {
    console.log(this.props.firebase)
    return (
      <div>
        <div>
          Super mooie SLIDE
        </div>
        <div>
          Super vette Notifications
          <Notifications/>
        </div>
      </div>
    )
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
