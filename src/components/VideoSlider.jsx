import React, { useState } from 'react'

const VideoSlider = ({ videos }) => {
 const [index, setIndex] = useState(0);
 // create state to keep track of images index, set the default index to 0

 const slideRight = () => {
  setIndex((index + 1) % videos.length);
  // increases index by 1
 };

 const slideLeft = () => {
  const nextIndex = index - 1;
  if (nextIndex < 0) {
   setIndex(videos.length - 1);
   // returns last index of images array if index is less than 0
  } else {
   setIndex(nextIndex);
  }
 };

 return (
  videos?.length > 0 && (
   <div className='image-slider-container'>
    <button className="image-slider-btn prev" onClick={slideLeft}>
     <i className='fa fas fa-chevron-left'></i>
    </button>
    <div style={{ display: 'block', width: "100%" }}>
     <iframe style={{
      border: "none",
      margin: "5px",
      borderRadius: "5px",
     }} title={index} allow="fullscreen;"
      src={`https://www.youtube.com/embed/${videos?.key}`}>
     </iframe>
    </div>

    <button className="image-slider-btn next" onClick={slideRight}>
     <i className='fa fas fa-chevron-right'></i>
    </button>
    <div className='image-slider-index'>{index + 1} / {videos?.length}</div>
   </div>
  )
 )
}

export default VideoSlider