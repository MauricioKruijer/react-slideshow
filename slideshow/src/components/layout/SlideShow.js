import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'
import FirebaseContext from '../Firebase/Context';

class SlideShow extends Component {
  state = {
    currentSlide: null,
    queue: []
  }

  componentDidMount() {
    // deal with firebase socket
    this.props.firebase.slides().once('value', snapshot => {
      const slides = snapshot.val();
      const keys = Object.keys(slides);
      const last = keys[keys.length-1];

      this.setState({
        ...this.state,
        queue: slides,
      })

      this.props.firebase.slides().orderByKey().startAt(last).on("child_added", snapshot => {
        const slide = snapshot.val();
        this.setState({
          queue: { [`${last}`]: slide, ...this.state.queue }
        });
        this.updateCurrentSlide(slide);
      });
    })

    // deal with queue
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

  updateCurrentSlide(slide) {
    this.props.firebase
      .storage
      .ref(slide.name)
      .getDownloadURL()
      .then(url => {
        console.log(url)
        this.setState({ ...this.state, currentSlide: url })
        console.log('jonge vette update', this.state)
      });
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
