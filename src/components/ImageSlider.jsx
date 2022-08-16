import React, { useEffect, useState } from 'react'
import { BD_LOADING } from '../apis/tmdb';

const ImageSlider = ({ images }) => {
 const [index, setIndex] = useState(0);
 const [loading, setLoading] = useState(true);
 // create state to keep track of images index, set the default index to 0

 const slideRight = () => {
  setIndex((index + 1) % images.length);
  // increases index by 1
 };

 const slideLeft = () => {
  const nextIndex = index - 1;
  if (nextIndex < 0) {
   setIndex(images.length - 1);
   // returns last index of images array if index is less than 0
  } else {
   setIndex(nextIndex);
  }
 };

 const imageLoaded = () => {
  setLoading(false)
 }

 useEffect(() => {
  if (index !== 0) setLoading(true)
 }, [index]);

 return (
  images.length > 0 && (
   <div className='image-slider-container'>
    <button className="image-slider-btn prev" onClick={slideLeft}>
     <i className='fa fas fa-chevron-left'></i>
    </button>
    <div style={{ display: loading ? 'none' : 'block', width: "100%" }}>
     <img className='detail-backdrop' src={images[index]} alt={index} onLoad={imageLoaded} />
    </div>
    <div style={{ display: loading ? 'block' : 'none', width: "100%" }}>
     <img style={{ objectFit: "cover", maxHeight: "450px" }} src={BD_LOADING} alt="loading" />
    </div>

    <button className="image-slider-btn next" onClick={slideRight}>
     <i className='fa fas fa-chevron-right'></i>
    </button>
    <div className='image-slider-index'>{index + 1} / {images?.length}</div>
   </div>
  )
 );
}

export default ImageSlider