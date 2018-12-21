import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'

class SlideShow extends Component {
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
