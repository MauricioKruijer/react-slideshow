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
    topItems: [],
    bottomItems: [],
    layout: 'one',
    flip: false,
  }

  componentDidMount() {
    this.props.firebase.slides().once('value', snapshot => {
      const slides = snapshot.val();
      const keys = Object.keys(slides);

      keys.forEach(key => {
        const slide = slides[key];
        this.preloadSlide(slide, key);
      });

      // start firebase listener to listen to every new entries after the last one that we get from .once('value'...
      const lastKey = keys[keys.length-1];
      this.firebaseSlideListener(lastKey)

      const yolo = setInterval(() => {
        if (this.slides.length < 2) return;

        this.startSlideTransitionQueue();
        clearInterval(yolo);
      }, 500);
    })
  }

  getTarget = () => {
    return this.state.flip ? 'topItems' : 'bottomItems';
  }

  getNextIndex = () => {
    return (this.currentIndex + 1) % this.slides.length;
  }

  startSlideTransitionQueue = () => {
    const duration = 5000;

    this.setState(() => ({
      topItems: [this.findCurrentItem()],
      bottomItems: [this.slides[this.getNextIndex()]],
    }), () => {
      this.currentIndex = this.getNextIndex();
    });

    this.slideTransitionQueue = setInterval(() => {
      if (this.canRunAfter > Date.now()) return;

      this.setState(() => ({
        [this.getTarget()]: [this.findCurrentItem()],
      }), () => {
        this.canRunAfter = Date.now() + duration;
        this.currentIndex = this.getNextIndex();
        this.setState((prevState) => ({
          flip: !prevState.flip,
        }));
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
    const { layout, topItems, bottomItems, flip } = this.state;
    const SlideComponent = SlideComponents[layout];

    console.log({ topItems, bottomItems });

    if (!topItems.length && !bottomItems.length) return null;

    return (
      <>
        <div style={{ transition: 'opacity 1s', opacity: flip ? 0 : 1 }}>
          <SlideComponent items={topItems} />
        </div>
        <div style={{ transition: 'opacity 1s', opacity: flip ? 1 : 0 }}>
          <SlideComponent items={bottomItems} />
        </div>
      </>
    );
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
