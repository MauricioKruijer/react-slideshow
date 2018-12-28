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
  slides = [];
  prioritySlides = [];
  currentIndex = 0;

  state = {
    currentItems: [],
    nextItems: [],
    layout: 'one',
    duration: 200,
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

      const nextIndex = (this.currentIndex + 1) % this.slides.length;

      this.setState(() => ({
        currentItems: [this.findCurrentItem()],
        nextItems: [this.slides[nextIndex]]
      }), () => {
        this.canRunAfter = Date.now() + duration;
        this.currentIndex = nextIndex;
      });
    }, 1000);
  }

  findCurrentItem() {
    const currentSlide = this.slides[this.currentIndex];
    if (this.prioritySlides.length > 0) {
      return this.prioritySlides.shift();
    }

    return currentSlide
  }

  firebaseSlideListener(key) {
    this.props.firebase.slides().orderByKey().startAt(key).on("child_added", snapshot => {
      const slide = snapshot.val();
      const slideKey = snapshot.key
      console.log('child added! yay', slideKey)
      if (key !== slideKey) {
        this.preloadSlide(slide, key, true)
      }
    });
  }

  preloadSlide(slide, key, isPriority = false) {
    const img = new Image();

    img.onload = () => {
      slide.url = img.src;
      slide.key = key

      this.slides = [slide, ...this.slides];
      if (isPriority) {
        console.log('prio slides')
        this.prioritySlides = [...this.prioritySlides, slide];
      }
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
    const { layout, currentItems, nextItems } = this.state;
    const SlideComponent = SlideComponents[layout];

    console.log('RERENDER', { slidesLength: this.slides.length });
    if (!this.slides.length) return null;

    return (
      <>
        <SlideComponent items={currentItems} />
      </>
    );
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
