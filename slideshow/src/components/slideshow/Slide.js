import React, { Component } from 'react';

class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      src: null
    };
  }

  componentDidMount() {
    this.setPreloader();
  }

  setPreloader() {
    this.preloader = new Image();
    this.preloader.onload = () => {
      this.setState({
        loaded: true,
        src: this.props.slide.url
      })
    };

    this.preloader.src = this.props.slide.url;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.slide.url !== prevProps.slide.url) {
      this.preloader = new Image();
      this.preloader.onload = () => {
        this.setState({
          loaded: true,
          src: this.props.slide.url
        })
      };

      this.preloader.src = this.props.slide.url;
    }

  }

  render() {
    return (
      <div
        // Required: Relative, absolute, or fixed position
        // Required: Width & height (explicitly or via top/right/bottom/left)
        // Optional: Background color or placeholder image
        className={this.props.className}
        style={{ ...this.props.style }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: `url(${this.state.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 3s ease-in-out',
          opacity: this.state.loaded ? 1 : 0
        }}></div>
      </div>
    )
  }
}

export default Slide
