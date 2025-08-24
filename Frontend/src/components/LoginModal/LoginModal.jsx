import { useState, useEffect } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { useFormAndValidation } from '../../../utils/useFormAndValidation.js';
import PropTypes from 'prop-types';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onLogin, isLoading, onClickRegister }) {
    const { values, handleChange, setValues, errors, isValid, resetForm } = 
    useFormAndValidation({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(values);
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    return (
        <ModalWithForm
            buttonText={isLoading ? 'Saving...' : 'Login'}
            title="Sign in"
            name="login"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            secondaryButtonText={"or Sign up"}
            secondaryButtonAction={onClickRegister}
        >
            <label htmlFor="login-email" className="modal__label">
                Email
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    className="modal__input"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                    value={values.email || ''}
                />
                <span id="input-error" className="modal__input-error">{errors.email}</span>
            </label>

            <label htmlFor="login-password" className="modal__label">
                Password
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    className="modal__input"
                    placeholder="Password"
                    required
                    minLength="8"
                    maxLength="20"
                    title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={handleChange}
                    value={values.password || ''}
                />
                <span id="input-error" className="modal__input-error">{errors.password}</span>
            </label>
        </ModalWithForm>
    );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default LoginModal;
