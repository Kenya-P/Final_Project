import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../../utils/useFormAndValidation.js";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLogin, isLoading, onClickRegister }) {
  const { values, handleChange, setValues, errors, isValid, resetForm } = useFormAndValidation({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "" });
      resetForm({ email: "", password: "" }, {}, false);
    }
  }, [isOpen, setValues, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onLogin({ email: values.email.trim(), password: values.password });
  };

  return (
    <ModalWithForm
      title="Log in"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Log in"
      isLoading={isLoading}
      disabled={!isValid}
      secondaryButtonText="Need an account? Register"
      secondaryButtonAction={onClickRegister}
    >
      <label className="modal__label">
        Email
        <input
          id="login-email"
          name="email"
          type="email"
          className="modal__input"
          placeholder="you@example.com"
          required
          onChange={handleChange}
          value={values.email || ""}
        />
        <span className="modal__input-error">{errors.email}</span>
      </label>

      <label className="modal__label">
        Password
        <input
          id="login-password"
          name="password"
          type="password"
          className="modal__input"
          placeholder="Password"
          minLength="8"
          maxLength="64"
          required
          autoComplete="off"
          onChange={handleChange}
          value={values.password || ""}
        />
        <span className="modal__input-error">{errors.password}</span>
      </label>
    </ModalWithForm>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onClickRegister: PropTypes.func,
};

