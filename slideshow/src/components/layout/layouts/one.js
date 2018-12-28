import React from 'react';
import get from 'lodash.get';

const One = ({ queue }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${get(queue, 'items[0].url', '')})`, backgroundSize: 'cover' }} />
);

export default One;
