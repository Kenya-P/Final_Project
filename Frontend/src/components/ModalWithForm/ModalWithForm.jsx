import React, { useEffect } from 'react';
import './ModalWithForm.css';

function ModalWithForm({ title, children, isOpen, onClose, onSubmit }) {
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscClose);
    }

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [isOpen, onClose]);

  function handleOverlayClick(e) {
    if (e.target.classList.contains('modal')) {
      onClose();
    }
  }

  return (
    <div className={`modal ${isOpen ? 'modal_opened' : ''}`} onClick={handleOverlayClick}>
      <div className="modal__container">
        <button type="button" className="modal__close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">{title}</h2>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
