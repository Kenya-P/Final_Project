import PropTypes from 'prop-types';
import useModalClose from '../../../utils/useModalClose.js';
import './ModalWithForm.css';

export default function ModalWithForm({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  buttonText = 'Submit',
  isLoading = false,
  disabled = false,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonAction,
}) {
  useModalClose(isOpen, onClose);

  const handleSecondary = (e) => {
    if (secondaryButtonAction) {
      e.preventDefault();
      secondaryButtonAction();
    }
  };

  return (
    <div className={`modal ${isOpen ? 'modal_opened' : ''}`}>
      <div className="modal__content">
        <button
          type="button"
          onClick={onClose}
          className="modal__close"
          aria-label="Close"
        />
        <h3 className="modal__title">{title}</h3>

        <form className="modal__form" onSubmit={onSubmit} noValidate>
          <fieldset className="modal__fieldset">{children}</fieldset>

          <div className="modal__actions">
            <button
              type="submit"
              className="modal__submit"
              disabled={disabled || isLoading}
              aria-busy={isLoading ? 'true' : 'false'}
            >
              {isLoading ? 'Please wait…' : buttonText}
            </button>

            {secondaryButtonText &&
              (secondaryButtonLink ? (
                <a className="modal__secondary" href={secondaryButtonLink}>
                  {secondaryButtonText}
                </a>
              ) : (
                <button
                  className="modal__secondary"
                  onClick={handleSecondary}
                  type="button"
                >
                  {secondaryButtonText}
                </button>
              ))}
          </div>
        </form>
      </div>
    </div>
  );
}

ModalWithForm.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  buttonText: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  secondaryButtonText: PropTypes.string,
  secondaryButtonLink: PropTypes.string,
  secondaryButtonAction: PropTypes.func,
};
