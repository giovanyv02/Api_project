import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [err, setErr] = useState("")

  


  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signDiv">
      <h1 className="signText">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signForm">
        <label className="signLabel">
          
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label className="signLabel">
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder=" Username"
          />
        </label>
        {errors.username && <p className="errors">{errors.username}</p>}
        <label className="signLabel">
         
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder=" First Name"
          />
        </label>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label className="signLabel">
          
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <label className="signLabel">
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label className="signLabel">
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button className="subButton" type="submit" disabled={username.length < 4 || password.length < 6 || !email || !lastName || !firstName || !confirmPassword}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;