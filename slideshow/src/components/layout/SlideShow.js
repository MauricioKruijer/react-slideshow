import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'

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
  }

  componentWillUnmount() {
    // unsubscribe from firebase
  }

  render () {
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

export default SlideShow
