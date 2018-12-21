import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <h1>Photo Video Slideshow!</h1>
      <Link to="/">Home</Link> <Link to="/upload">Upload</Link>
    </nav>
  )
}

export default Navbar
