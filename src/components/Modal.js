import React from 'react'
import ReactDom from 'react-dom'

const MODAL_STYLES = {
    position: 'fixed',
    marginLeft: '5%',
    marginRight: '5%',
    top: '10%',
    left: '45%',
    transform: 'translate(-50%,-50%)',
    backgroundColor: '#FFF',
    padding: '10px 10px',
    width: '80%',
    zIndex: 1000,
    borderRadius: '15px',
}

const MODAL_STYLES2 = {
    backgroundColor: '#FFF',
    padding: '10px 10px',
    borderRadius: '15px',
    position: 'fixed',
    top: "10%",
    left: "40%",
    right: "auto",
    bottom: "auto",
    maxHeight: "calc(100vh-2rem)",
    maxWidth: "600px",
    // width: "auto",
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
}

const Modal = ({ open, children, onClose }) => {
    if (!open) return null;

    return ReactDom.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES2}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>
                    <span
                        className='modal-close'
                        role='button'
                        onClick={onClose}>
                        <i className='fa fas fa-times'></i>
                    </span>
                </div>

                {children}
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default Modal