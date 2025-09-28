import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { useFormAndValidation } from '../../../utils/useFormAndValidation.js';
import { LOGIN_INITIAL } from '../../config/constants.js';
import './LoginModal.css';

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  isLoading,
  onClickRegister,
  errorText,
}) {
  const { values, handleChange, setValues, errors, isValid, resetForm } =
    useFormAndValidation(LOGIN_INITIAL);

  // Reset only when opened to avoid render loops
  useEffect(() => {
    if (!isOpen) return;
    resetForm(LOGIN_INITIAL, {}, false);
  }, [isOpen, resetForm]);

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onLogin?.({ email: values.email, password: values.password });
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Sign in"
      subText={
        <span>
          or{' '}
          <button type="button" className="auth-link" onClick={onClickRegister}>
            Sign up
          </button>
        </span>
      }
      buttonText={isLoading ? 'Logging in…' : 'Login'}
      disabled={!isValid || isLoading}
    >
      <label className="modal__label" htmlFor="login-email">
        Email
      </label>
      <input
        id="login-email"
        name="email"
        type="email"
        className="modal__input auth-input"
        placeholder="you@example.com"
        required
        onChange={handleChange}
        value={values.email || ''}
      />
      <span className="modal__input-error">{errors.email}</span>

      <label className="modal__label" htmlFor="login-password">
        Password
      </label>
      <input
        id="login-password"
        name="password"
        type="password"
        className="modal__input auth-input"
        placeholder="Password"
        minLength="8"
        maxLength="64"
        required
        autoComplete="off"
        onChange={handleChange}
        value={values.password || ''}
      />
      <span className="modal__input-error">{errors.password}</span>

      {errorText && (
        <p role="alert" className="auth-error">
          {errorText}
        </p>
      )}
    </ModalWithForm>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onClickRegister: PropTypes.func,
  errorText: PropTypes.string,
};
