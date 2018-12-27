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
  }

  componentDidMount() {
    // deal with firebase socket
    this.props.firebase.slides().once('value', snapshot => {
      const slides = snapshot.val();
      const keys = Object.keys(slides);

      keys.forEach(key => {
        const slide = slides[key];
        this.preloadSlide(slide);
      })

      // const last = keys[keys.length-1];

      // this.setState({
      //   queue: slides,
      // })

      // this.props.firebase.slides().orderByKey().startAt(last).on("child_added", snapshot => {
      //   const slide = snapshot.val();
      //   this.setState({
      //     queue: { [`${last}`]: slide, ...this.state.queue }
      //   });
      //   this.updateCurrentSlide(slide);
      // });
    })

    // deal with queue
  }

  preloadSlide(slide) {
    const img = new Image();

    img.onload = () => {
      console.log(slide.name, 'preloaded!');
      let state = {};
      slide.url = img.src;

      if (this.state.currentSlide.name === null) {
        console.log('set current slide (once)')
        state = { currentSlide: slide };
      }

      if (this.state.nextSlide.name === null && this.state.currentSlide.name !== null) {
        console.log('set NEXT slide (once)')
        state = { nextSlide: slide };
      }
      console.log({ slides: [slide, ...this.state.slides]})

      this.setState((p) => ({...p, ...state, slides: [slide, ...this.state.slides]}));
    }

    this.props.firebase
      .storage
      .ref(slide.name)
      .getDownloadURL()
      .then(url => {
        img.src = url;
      });
  }

  updateCurrentSlide(slide) {
    this.props.firebase
      .storage
      .ref(slide.name)
      .getDownloadURL()
      .then(url => {
        console.log(url)
        this.setState({ ...this.state, currentSlide: { url, meta: slide.meta }})
        console.log('jonge vette update', this.state)
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
            <Slide current={this.state.currentSlide} next={this.state.nextSlide} slides={this.state.slides} firebase={this.props.firebase}/>
          }
        </div>
      </div>
    )
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <SlideShow firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
