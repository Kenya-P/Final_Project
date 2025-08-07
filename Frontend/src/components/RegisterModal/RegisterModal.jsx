import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ name, email, password });
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <ModalWithForm
      title="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        value={name}
        placeholder="Name"
        required
        onChange={(e) => setName(e.target.value)}
        className="modal__input"
      />
      <input
        type="email"
        name="email"
        value={email}
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
        className="modal__input"
      />
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
        className="modal__input"
      />
      <button type="submit" className="modal__submit-button">
        Register
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
