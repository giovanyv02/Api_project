// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const err = {}
  if(credential.length < 4) err['credential'] = "name needs to be at least 4 characters";
  if(password.length < 6) err['password'] = "password needs to be at least 6 characters";
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demo = ()=>{
    const credential = "Demo-lition";
    const password = "password"

    return dispatch(sessionActions.login({credential, password}))
    .then(closeModal)
  }

  return (
    <div className="log">
      <h1 className="login">Log In</h1>
      <form onSubmit={handleSubmit} className="logForm">
        <label className="logLabel">
         
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
        </label>
        <label className="logLabel">
         
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" Password"
          />
        </label>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <button className="subButton" type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
      </form>

      <button className="demoButton" onClick={demo}>Demo user</button>
    </div>
  );
}

export default LoginFormModal;