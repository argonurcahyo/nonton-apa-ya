import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSlider = ({ images, variant = "backdrop" }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const thumbnailsRef = useRef(null);
  const activeThumbRef = useRef(null);

  const isPoster = variant === "poster";
  const mainAspectClass = isPoster ? "aspect-[2/3]" : "aspect-video";
  const thumbAspectClass = isPoster ? "aspect-[2/3]" : "aspect-video";
  const thumbWidthClass = isPoster ? "w-20 md:w-24" : "w-24 md:w-32";

  // Trigger loading state whenever the index changes
  useEffect(() => {
    setLoading(true);
  }, [index]);

  // Auto-scroll thumbnails to center active image
  useEffect(() => {
    if (activeThumbRef.current && thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const activeThumb = activeThumbRef.current;
      
      const containerWidth = container.offsetWidth;
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.offsetWidth;
      
      // Calculate scroll position to center the thumbnail
      const scrollPosition = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [index]);

  // Guard clause if no images are provided (after all hooks)
  if (!images || images.length === 0) return null;

  const slideRight = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const slideLeft = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (newIndex) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  const imageLoaded = () => {
    setLoading(false);
  };

  // Subtle, premium fade-slide animation
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
  };

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 1. Main Image Viewer */}
      <div className={`group relative w-full ${mainAspectClass} rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800`}>
        
        {/* Skeleton/Spinner (Stays behind the image) */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 z-0">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-slate-300 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {/* Animated Image */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
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
            src={images[index]}
            alt={`Backdrop ${index + 1}`}
            onLoad={imageLoaded}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        </AnimatePresence>

        {/* Navigation Arrows (Visible on Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={slideLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left ml-[-2px]"></i>
            </button>

            <button
              onClick={slideRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right mr-[-2px]"></i>
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 2. Thumbnail Strip */}
      {images.length > 1 && (
        <div 
          ref={thumbnailsRef}
          className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
        >
          {images.map((img, i) => (
            <button
              key={i}
              ref={i === index ? activeThumbRef : null}
              onClick={() => goToImage(i)}
              className={`relative flex-shrink-0 ${thumbWidthClass} ${thumbAspectClass} snap-start rounded-xl overflow-hidden transition-all duration-300 ${
                i === index
                  ? 'ring-2 ring-emerald-500 shadow-lg scale-100 opacity-100'
                  : 'ring-1 ring-slate-300 dark:ring-slate-700 scale-95 opacity-50 hover:opacity-100 hover:scale-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Active state dark overlay subtle tint */}
              {i !== index && (
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-300"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;