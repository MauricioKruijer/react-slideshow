import React from 'react';

const One = ({ items }) => {
  const currentItem = items[0]

  return (
    <div className="yolo" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${currentItem.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      imageOrientation: 'from-image',
    }} />
  )
};

export default One;
