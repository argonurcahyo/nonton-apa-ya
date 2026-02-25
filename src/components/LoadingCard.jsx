import React from 'react'
import { motion } from 'framer-motion'

const LoadingCard = () => {
  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  return (
    <motion.div 
      variants={shimmerVariants}
      animate="shimmer"
      className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
      style={{ backgroundPosition: '200% 0' }}
    />
  )
}

export default LoadingCard