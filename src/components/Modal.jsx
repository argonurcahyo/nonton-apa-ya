import React from 'react'
import ReactDom from 'react-dom'

const MODAL_STYLES2 = {
 backgroundColor: '#ffffff',
 padding: '0',
 borderRadius: '15px',
 position: 'fixed',
 top: "10%",
 left: "40%",
 right: "auto",
 bottom: "auto",
 maxHeight: "calc(100vh-2rem)",
 maxWidth: "600px",
 transform: "translate(-40%, -10%)",
 zIndex: 1000
}

const OVERLAY_STYLES = {
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 backgroundColor: 'rgba(0,0,0,.7)',
 zIndex: 1000,
 transition: "all 500ms ease-in -out"

}

const Modal = ({ open, children, onClose }) => {
 if (!open) return null;

 return ReactDom.createPortal(
  <div className="modal">
   <div className="modal-overlay" style={OVERLAY_STYLES} />
   <div className="modal-container" style={MODAL_STYLES2}>
    <div style={{ marginBottom: "10px" }}>
     <span
      className='modal-close'
      onClick={onClose}>
      CLOSE
     </span>
    </div>
    <div className="modal-content">
     {children}
    </div>
   </div>
  </div>,
  document.getElementById('portal')
 )
}

export default Modal