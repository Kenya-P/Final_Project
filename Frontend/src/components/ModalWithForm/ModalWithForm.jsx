import React, { useEffect } from 'react';
import './ModalWithForm.css';

function ModalWithForm({ isOpen, onClose, children, title }) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Close on outside click
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal__container">
        <button className="modal__close" onClick={onClose}>×</button>
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default ModalWithForm;

