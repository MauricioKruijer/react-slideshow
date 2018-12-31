import React from 'react';

const One = ({ items }) => {
  const currentItem = items[0]
/*
    <img src={currentItem.url} className="yolo" style={{
      display: 'block',
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      imageOrientation: 'from-image',
    }} />
 */

  return ( console.log("lalala") ,
    <>
      {currentItem.type === 'image' ?
        <img src={currentItem.url} className="yolo" style={{
          display: 'block',
          // width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          imageOrientation: 'from-image',
        }}/>
        : <video autoPlay loop style={{
          display: 'block',
          // width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
        }}>
          <source type="video/mp4" src={currentItem.url} />
        </video>
      }
    </>

  )
};

export default One;
