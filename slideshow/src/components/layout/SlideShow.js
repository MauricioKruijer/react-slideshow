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

    // deal with queue
    console.log(this.props.firebase.slides())
    this.props.firebase.slides().on('value', snapshot => {
      console.log(snapshot.val());
    })
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
