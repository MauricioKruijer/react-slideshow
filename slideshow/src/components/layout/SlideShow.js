import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'
import Slide from '../slideshow/Slide';
import FirebaseContext from '../Firebase/Context';

class SlideShow extends Component {
  state = {
    currentSlide: {
      name: null,
      meta: {}
    },
    nextSlide: {
      name: null,
      meta: {}
    },
    queue: [],
    slides: [],
    firebaseListener: false
  }

  componentDidMount() {
    this.props.firebase.slides().once('value', snapshot => {
      const slides = snapshot.val();
      const keys = Object.keys(slides);

      keys.forEach(key => {
        const slide = slides[key];
        this.preloadSlide(slide, key);
      })

      // start firebase listener to listen to every new entries after the last one that we get from .once('value'...
      const lastKey = keys[keys.length-1];
      this.firebaseSlideListener(lastKey)
    })
  }

  firebaseSlideListener(key) {
    this.props.firebase.slides().orderByKey().startAt(key).on("child_added", snapshot => {
      const slide = snapshot.val();
      const slideKey = snapshot.key

      if (key !== slideKey) {
        this.preloadSlide(slide, key)
      }
    });
  }

  preloadSlide(slide, key) {
    const img = new Image();

    img.onload = () => {
      slide.url = img.src;
      slide.key = key

      this.setState((prevState) => ({slides: [slide, ...prevState.slides]}));
      console.log(this.state)
    }

    this.props.firebase
      .storage
      .ref(slide.name)
      .getDownloadURL()
      .then(url => {
        img.src = url;
      });
  }

  render () {
    return (
      <div>
        <div>
          Super mooie SLIDE
        </div>
        <div style={{ height: '80%', position: 'absolute', width: '100%' }}>
          Super vette Notifications
          <Notifications/>
          {
            (this.state.currentSlide && this.state.currentSlide.name) &&
            (this.state.nextSlide && this.state.nextSlide.name) &&
            <Slide current={this.state.currentSlide} next={this.state.nextSlide} />
          }
        </div>
      </div>
    )
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
