import React from 'react'
import ReactDom from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ open, children, onClose }) => {
 if (!open) return null;

 return ReactDom.createPortal(
  <AnimatePresence>
   {open && (
    <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 z-50 flex items-center justify-center"
    >
     {/* Overlay */}
     <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
     />
     
     {/* Modal Content */}
     <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] w-11/12 max-w-4xl overflow-y-auto custom-scrollbar"
     >
      {/* Close Button */}
      <motion.button
       whileHover={{ scale: 1.1 }}
       whileTap={{ scale: 0.95 }}
       onClick={onClose}
       className="absolute top-4 right-4 z-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
       <i className="fa-solid fa-times text-lg"></i>
      </motion.button>

      {/* Modal Body */}
      <div className="p-6 md:p-8">
       {children}
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>,
  document.getElementById('portal')
 )
}

export default Modal