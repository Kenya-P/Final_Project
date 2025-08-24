import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useModalClose from '../../../utils/useModalClose.js';
import './ModalWithForm.css';

function ModalWithForm({children, buttonText, title, isOpen, onClose, name, onSubmit, secondaryButtonText, secondaryButtonLink, secondaryButtonAction, isLoading, disabled}) {
    useModalClose(isOpen, onClose);
    
    return (
        <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
            <div className="modal__content">
                <button
                    type="button"
                    onClick={onClose}
                    className="modal__close"
                />
                <h3 className="modal__title">{title}</h3>
                <form onSubmit={onSubmit} className="modal__form">
                    {children}
                    <div className="modal__button-container">
                        <button
                            type="submit"
                            className="modal__submit"
                            disabled={isLoading || disabled}
                        >
                            {buttonText}
                        </button>
                            {secondaryButtonText && secondaryButtonAction && (
                            <button
                                type="button"
                                className="modal__secondary-button"
                                onClick={secondaryButtonAction}
                            >
                                {secondaryButtonText}
                            </button>
                            )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalWithForm;

ModalWithForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};