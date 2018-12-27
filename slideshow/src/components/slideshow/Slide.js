import React, { Component } from 'react';
import { Transition, animated } from 'react-spring'

class Slide extends Component {
  state = {
    current: {
      name: null
    }
  }

  componentWillReceiveProps() {
    const { slides } = this.props;
    const keys = Object.keys(slides);
    const first = slides[keys[0]]

    console.log({ slides, keys, first })
    if (first) {
      this.setState({
        current: first,
      });
    }
  }

  render() {
    console.log('reender', this.state.toggle) ;
    const { current } = this.state;
    const { slides } = this.props;

    console.log({ slides, current })

    return (
      <Transition
        items={slides}
        from={{ position: 'absolute', opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}>
        {current =>
          current
            ? props => <div style={props}>{this.state.current.name}</div>
            : props => <div style={props}>🤪</div>
        }
      </Transition>
    )
  }
}

export default Slide
