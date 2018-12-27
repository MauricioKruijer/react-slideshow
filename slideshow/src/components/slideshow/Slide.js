import React, { Component } from 'react';
import { Transition, animated } from 'react-spring'

const defaultStyles = {
  overflow: 'hidden',
  width: '100%',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2em',
  fontFamily: "'Kanit', sans-serif",
  textTransform: 'uppercase',
}

class Slide extends Component {
  state = {
    needToUpdate: false
  }
  componentDidMount () {
    const timeoutID = setTimeout(() => {
      this.setState({
        needToUpdate: true
      });
      clearTimeout(timeoutID);
    }, 3000)
  }
  // componentWillReceiveProps(prevProps) {
  // componentDidUpdate(prevProps) {
  //   if(prevProps.current.name !== this.props.current.name) {
  //
  //   }
  // }

  static getDerivedStateFromProps(props, state) {
    console.log('huuuh')
    // if (props.next && props.next.name && !state.needToUpdate) {
    //   return {
    //     needToUpdate: false
    //   };
    // }
    //
    return null;
  }

  render() {
    return (
      <Transition
        items={this.state.needToUpdate}
        from={{ position: 'absolute', opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}>
        { current => {
          return current
            ? props => <div style={props}>{this.props.current.name}</div>
            : props => <div style={props}>🤪{this.props.next.name}</div>
        }}
      </Transition>
    )
  }
}

export default Slide
