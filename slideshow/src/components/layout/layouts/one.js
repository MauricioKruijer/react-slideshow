import React from 'react';

const One = ({ slides, queue }) => {
  const hasPriorityItems = queue.priority.length > 0;
  const currentItem = hasPriorityItems
    ? queue.priority[0]
    : slides[queue.currentSlideIndex];

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
