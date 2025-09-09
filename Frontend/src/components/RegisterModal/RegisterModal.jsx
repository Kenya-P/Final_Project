import { useEffect } from "react";
import PropTypes from "prop-types";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../../utils/useFormAndValidation.js";
import "./RegisterModal.css";

export default function RegisterModal({ isOpen, onClose, onRegister, isLoading, onClickLogin }) {
  const { values, handleChange, setValues, errors, isValid, resetForm } = useFormAndValidation({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      const empty = { name: "", avatar: "", email: "", password: "" };
      setValues(empty);
      resetForm(empty, {}, false);
    }
  }, [isOpen, setValues, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onRegister({
      name: values.name.trim(),
      avatar: values.avatar.trim(),
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <ModalWithForm
      title="Create an account"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Register"
      isLoading={isLoading}
      disabled={!isValid}
      secondaryButtonText="Already have an account? Log in"
      secondaryButtonAction={onClickLogin}
    >
      <label className="modal__label">
        Name
        <input
          name="name"
          type="text"
          className="modal__input"
          placeholder="Your name"
          required
          minLength="2"
          maxLength="30"
          onChange={handleChange}
          value={values.name || ""}
        />
        <span className="modal__input-error">{errors.name}</span>
      </label>

      <label className="modal__label">
        Avatar URL
        <input
          name="avatar"
          type="url"
          className="modal__input"
          onChange={handleChange}
          value={values.avatar || ""}
        />
        <span className="modal__input-error">{errors.avatar}</span>
      </label>

      <label className="modal__label">
        Email
        <input
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
          name="password"
          type="password"
          className="modal__input"
          placeholder="Password"
          required
          minLength="8"
          maxLength="64"
          onChange={handleChange}
          value={values.password || ""}
        />
        <span className="modal__input-error">{errors.password}</span>
      </label>
    </ModalWithForm>
  );
}

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onClickLogin: PropTypes.func,
};

