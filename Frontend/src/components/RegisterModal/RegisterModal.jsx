import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../../utils/useFormAndValidation.js";
import "./RegisterModal.css";

export default function RegisterModal({ isOpen, onClose, onRegister, isLoading, onClickLogin, errorText }) {
  const { values, handleChange, setValues, errors, isValid, resetForm } = useFormAndValidation({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });

  // Reset only when opened to avoid render loops
  useEffect(() => {
    if (isOpen) {
      setValues({ name: "", avatar: "", email: "", password: "" });
      resetForm({ name: "", avatar: "", email: "", password: "" }, {}, false);
    }
  }, [isOpen]);


  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onRegister?.({
      name: values.name,
      avatar: values.avatar,
      email: values.email,
      password: values.password,
    });
  };

  if (!isOpen) return null;

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      title="Sign up"
      subText={<span>or <button type="button" className="auth-link" onClick={onClickLogin}>Sign in</button></span>}
      buttonText={isLoading ? "Creating…" : "Create account"}
      disabled={!isValid || isLoading}
    >
      <label className="modal__label" htmlFor="reg-name">Name</label>
      <input
        id="reg-name"
        name="name"
        type="text"
        className="modal__input auth-input"
        placeholder="Your name"
        minLength="2"
        maxLength="30"
        required
        onChange={handleChange}
        value={values.name || ""}
      />
      <span className="modal__input-error">{errors.name}</span>

      <label className="modal__label" htmlFor="reg-avatar">Avatar URL (optional)</label>
      <input
        id="reg-avatar"
        name="avatar"
        type="url"
        className="modal__input auth-input"
        placeholder="https://…"
        onChange={handleChange}
        value={values.avatar || ""}
      />
      <span className="modal__input-error">{errors.avatar}</span>

      <label className="modal__label" htmlFor="reg-email">Email</label>
      <input
        id="reg-email"
        name="email"
        type="email"
        className="modal__input auth-input"
        placeholder="you@example.com"
        required
        onChange={handleChange}
        value={values.email || ""}
      />
      <span className="modal__input-error">{errors.email}</span>

      <label className="modal__label" htmlFor="reg-password">Password</label>
      <input
        id="reg-password"
        name="password"
        type="password"
        className="modal__input auth-input"
        placeholder="Password (8–64 chars)"
        minLength="8"
        maxLength="64"
        required
        autoComplete="off"
        onChange={handleChange}
        value={values.password || ""}
      />
      <span className="modal__input-error">{errors.password}</span>

      {errorText && <p role="alert" className="auth-error">{errorText}</p>}
    </ModalWithForm>
  );
}

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onClickLogin: PropTypes.func,
  errorText: PropTypes.string,
};