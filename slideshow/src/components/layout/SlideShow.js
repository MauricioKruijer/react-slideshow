import React, { Component } from 'react';
import Notifications from '../slideshow/Notification'
import Slide from '../slideshow/Slide';
import FirebaseContext from '../Firebase/Context';

import One from './layouts/one';

const findNextIndex = (arr, currIndex) => {
  const lastIndex = arr.length ? arr.length - 1 : 0;
  const nextIndex = currIndex + 1;

  if (nextIndex > lastIndex) {
    return 0;
  }

  return nextIndex;
}

const SlideComponents = {
  one: One,
};

class SlideShow extends Component {
  canRunAfter = Date.now();

  state = {
    currentSlide: {
      name: null,
      meta: {}
    },
    nextSlide: {
      name: null,
      meta: {}
    },
    queue: {
      currentSlideIndex: 0,
      priority: [],
      layout: 'one',
      duration: 200,
    },
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
      this.startSlideTransitionQueue();
    })
  }

  startSlideTransitionQueue = () => {
    this.transitionQueue = setInterval(() => {
      console.log('Can we run?', {
        canRunAfter: this.canRunAfter,
        now: Date.now(),
        CAN_CONTINUE: this.canRunAfter > Date.now(),
      });

      if (this.canRunAfter > Date.now()) return;

      const duration = 5000;

      this.setState((prevState) => ({
        queue: {
          currentSlideIndex: findNextIndex(prevState.slides, prevState.queue.currentSlideIndex),
          priority: [],
          layout: 'one',
          duration,
        },
      }), () => {
        this.canRunAfter = Date.now() + duration;
      });
    }, 1000);
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
    const { queue, slides } = this.state;
    const SlideComponent = SlideComponents[queue.layout];

    console.log('RERENDER', { slidesLength: slides.length });
    if (!slides.length) return null;

    return <SlideComponent slides={slides} queue={queue} />;
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
