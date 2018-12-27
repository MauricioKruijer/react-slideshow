import React, { Component } from 'react';
import { Spring, animated, config } from 'react-spring'
const { Provider, Consumer } = React.createContext()

class RewindSpringProvider extends React.Component {
  constructor() {
    super()
    this.state = { flip: false }
  }

  render() {
    const { flip } = this.state
    const { children, ...props } = this.props
    return (
      <Spring
        native
        reset
        reverse={flip}
        from={{ progress: '0%', x: 0 }}
        to={{ progress: '100%', x: 1 }}
        delay={200}
        config={config.molasses}
        {...props}
        onRest={() => this.setState(state => ({ flip: !state.flip }))}>
        {props => <Provider value={props} children={children} />}
      </Spring>
    )
  }
}
const mau = {
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
}
const RewindSpring = ({ children, style, hideProgress }) => (
  <RewindSpringProvider>
    <div style={{ overflow: 'hidden', background: '#f4f6f9', color: 'rgb(45, 55, 71)', ...mau, ...style }}>
      <Consumer>
        {({ progress, x }) => (
          <React.Fragment>
            {children(x)}
            {!hideProgress && (
              <animated.div
                style={{
                  position: 'absolute',
                  zIndex: 1000,
                  left: 0,
                  bottom: 0,
                  height: 10,
                  width: progress,
                  background: '#ffd500',
                }}
              />
            )}
          </React.Fragment>
        )}
      </Consumer>
    </div>
  </RewindSpringProvider>
)

class Slide extends Component {
  render() {
    return (
      <RewindSpring>
        {x => (
          <>
            <animated.div style={{ opacity: x.interpolate({ range: [0.75,1.0], output: [0,1] }), transform: x.interpolate({ range: [0.75,1.0], output: [-40,0], extrapolate: 'clamp' }).interpolate(x => `translate3d(0,${x}px,0)`) }}>1</animated.div>
            <animated.div style={{ opacity: x.interpolate({ range: [0.25,0.5], output: [0,1] }), transform: x.interpolate({ range: [0.25,0.5], output: [-40,0], extrapolate: 'clamp' }).interpolate(x => `translate3d(0,${x}px,0)`) }}>2</animated.div>
            <animated.div style={{ opacity: x.interpolate({ range: [0.0,0.25], output: [0,1] }), transform: x.interpolate({ range: [0.0,0.25], output: [-40,0], extrapolate: 'clamp' }).interpolate(x => `translate3d(0,${x}px,0)`) }}>3</animated.div>
            <animated.div style={{ opacity: x.interpolate({ range: [0.5,0.75], output: [0,1] }), transform: x.interpolate({ range: [0.5,0.75], output: [-40,0], extrapolate: 'clamp' }).interpolate(x => `translate3d(0,${x}px,0)`) }}>4</animated.div>
          </>
        )}
      </RewindSpring>
    )
  }
}

export default Slide
