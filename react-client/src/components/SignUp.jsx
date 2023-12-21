import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createUser } from "../firebase/AuthFunctions";
import {UserContext} from '../context/UserContext';
import { googleLogIn } from "../firebase/AuthFunctions";

function SignUp() {
  const { currentUser } = useContext(UserContext);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { email, password, matchPassword } = event.target.elements;
    if (password.value !== matchPassword.value) {
      setPasswordsMatch(false);
      return false;
    }

    try {
      await createUser(email.value, password.value);
      navigate("/sign-up-config");
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleSignUp = async (event) => {
    event.preventDefault();
    try {
      await googleLogIn();
      navigate("/sign-up-config");
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="form card">
      <div className="card_header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
        </svg>
        <h1 className="form_heading">Sign Up</h1>
      </div>
      {!passwordsMatch && (
        <h4 className="error">{"Passwords do not match"}</h4>
      )}
      <form onSubmit={handleSignUp}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" required name="email" type="email" placeholder="Email" id="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password
          <div class="passwordTooltip">&nbsp;?
            <small id="passValidations" class="passwordTooltipText">
              Password must be a minimum of 8 characters long,
              have at least one at least one uppercase and lowercase character, have at least one number, 
              and has to contain at least one special character (!@#$%&?).
            </small>
          </div>
          </label>
          <input className="input" id="password" name="password" type="password" pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&?]).{8,})" aria-describedby="passValidations" placeholder="Password" autoComplete="off" required />
        </div>
        <div className="field">
          <label htmlFor="matchPassword">Confirm Password</label>
          <input className="input" name="matchPassword" type="password" placeholder="Confirm Password" autoComplete="off" required />
        </div>

        <div className="buttons-container">

        <button className='button-sign' id="submitButton" name="submitButton" type="submit">
          <span>Sign Up</span>
        </button>

        <button className='button-sign' onClick={handleGoogleSignUp}>
        <span>Sign up with Google</span>
        </button>
        </div>
        </form>
        </div>
  );
}

export default SignUp;
