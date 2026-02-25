import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VideoSlider = ({ videos }) => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const thumbnailsRef = useRef(null)
  const activeThumbRef = useRef(null)

  // Auto-scroll thumbnails to center active video
  useEffect(() => {
    if (activeThumbRef.current && thumbnailsRef.current) {
      const container = thumbnailsRef.current
      const activeThumb = activeThumbRef.current
      
      const containerWidth = container.offsetWidth
      const thumbLeft = activeThumb.offsetLeft
      const thumbWidth = activeThumb.offsetWidth
      
      // Calculate scroll position to center the thumbnail
      const scrollPosition = thumbLeft - (containerWidth / 2) + (thumbWidth / 2)
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [index])

  // Guard clause if no videos are provided (after all hooks)
  if (!videos || videos.length === 0) return null

  const slideRight = () => {
    setDirection(1)
    setIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const slideLeft = () => {
    setDirection(-1)
    setIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
  }

  const goToVideo = (newIndex) => {
    setDirection(newIndex > index ? 1 : -1)
    setIndex(newIndex)
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '15%' : '-15%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? '15%' : '-15%',
      opacity: 0,
      scale: 0.98,
      zIndex: 0
    })
  }

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 1. Main Video Player */}
      <div className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-700">
        
        {/* Animated Video */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.4 }
            }}
            className="absolute inset-0 z-10"
          >
            <iframe
              className="w-full h-full"
              title={videos[index]?.name || `Video ${index + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              src={`https://www.youtube.com/embed/${videos[index]?.key}`}
              style={{ border: 'none' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Visible on Hover) */}
        {videos.length > 1 && (
          <>
            <button
              onClick={slideLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Previous video"
            >
              <i className="fa-solid fa-chevron-left ml-[-2px]"></i>
            </button>

            <button
              onClick={slideRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Next video"
            >
              <i className="fa-solid fa-chevron-right mr-[-2px]"></i>
            </button>
          </>
        )}

        {/* Video Counter Badge */}
        {videos.length > 1 && (
          <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {index + 1} / {videos.length}
          </div>
        )}

        {/* Video Title */}
        {videos[index]?.name && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
            <h4 className="text-white text-lg font-bold line-clamp-2">
              {videos[index].name}
            </h4>
          </div>
        )}
      </div>

      {/* 2. Video Thumbnail Strip */}
      {videos.length > 1 && (
        <div 
          ref={thumbnailsRef}
          className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
        >
          {videos.map((video, i) => (
            <button
              key={video.id || i}
              ref={i === index ? activeThumbRef : null}
              onClick={() => goToVideo(i)}
              className={`relative flex-shrink-0 w-48 md:w-56 aspect-video snap-start rounded-xl overflow-hidden transition-all duration-300 bg-slate-800 ${
                i === index
                  ? 'ring-2 ring-emerald-500 shadow-lg scale-100 opacity-100'
                  : 'ring-1 ring-slate-600 scale-95 opacity-50 hover:opacity-100 hover:scale-100'
              }`}
            >
              {/* YouTube Thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                alt={video.name || `Video ${i + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  i === index ? 'bg-emerald-600' : 'bg-black/60 group-hover:bg-emerald-600'
                }`}>
                  <i className="fa-solid fa-play text-white ml-1"></i>
                </div>
              </div>

              {/* Video Title Overlay */}
              {video.name && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                  <p className="text-white text-xs font-medium line-clamp-2">
                    {video.name}
                  </p>
                </div>
              )}

              {/* Inactive overlay */}
              {i !== index && (
                <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors duration-300"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoSlider