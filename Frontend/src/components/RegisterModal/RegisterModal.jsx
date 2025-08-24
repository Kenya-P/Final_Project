import { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { useFormAndValidation } from '../../../utils/useFormAndValidation.js';
import PropTypes from 'prop-types';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister, isLoading, onClickLogin }) {
  const {
      values,
      handleChange,
      setValues,
      errors,
      resetForm,
      isValid
  } = useFormAndValidation({
      name: '',
      email: '',
      password: '',
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && Object.keys(errors).length === 0) {
      onRegister({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    }
  }

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <ModalWithForm
      buttonText={isLoading ? "Saving..." : "Sign Up"}
      title="Sign up"
      name="register"
      isOpen={isOpen}
      onClose={handleClose}
      onOverlayClose={handleClose}
      onSubmit={handleSubmit}
      secondaryButtonText={"or Log in"}
      secondaryButtonAction={onClickLogin}
    >

    <label htmlFor="register-email" className="modal__label">
      Email
        <input
          id="register-email"
          name="email"
          type="email"
          className="modal__input"
          placeholder="Email"
          required
          onChange={handleChange}
          value={values.email || ''}
        />
          <span className="modal__input-error">{errors.email}</span>
        </label>

        <label htmlFor="register-password" className="modal__label">
          Password
            <input
              id="register-password"
              name="password"
              type="password"
              className="modal__input"
              placeholder="Password"
              required
              minLength="8"
              maxLength="20"
              title="Password must be at least 8 characters and and contain at least one letter and one number."
              autoComplete="off"
              autoCorrect="off"
              onChange={handleChange}
              value={values.password || ''}
            />
              <span className="modal__input-error">{errors.password}</span>
        </label>

        <label htmlFor="register-name" className="modal__label">
          Name
            <input
              type="text"
              name="name"
              className="modal__input"
              placeholder="Name"
              //pattern="^[a-zA-Z\s\-]+$"
              title="Name should contain only letters, spaces or hyphens"
              value={values.name || ''}
              onChange={handleChange}
              required
            />
              <span className="modal__input-error">{errors.name}</span>
          </label>
      <button type="submit" className="modal__submit-button">
        Register
      </button>
    </ModalWithForm>
  );
}

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};


export default RegisterModal;
