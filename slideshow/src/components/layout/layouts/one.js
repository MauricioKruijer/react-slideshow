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
  return (
    <img src={currentItem.url} className="yolo" style={{
      display: 'block',
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      imageOrientation: 'from-image',
    }} />

  )
};

export default One;
