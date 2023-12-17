import React, {useContext, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {createUser} from '../firebase/AuthFunctions';
import {Context} from '../firebase/Context';
import { googleSignIn } from './SignIn';

function SignUp() {
  const {currentUser} = useContext(Context);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {email, password, matchPassword} = event.target.elements;
    if (password.value !== matchPassword.value) {
      setPasswordsMatch(false);
      return false;
    }

    try {
      await createUser(
        email.value,
        password.value,
      );
      navigate('/sign-up-config');
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleSignUp = async (event) => {
    event.preventDefault();
    try {
      googleSignIn();
      navigate('/sign-up-config');
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div className='card'>
      <h1>Sign up</h1>
        {!passwordsMatch ? (
            <h4 className='error'>{'Passwords do not match'}</h4>
        ) : null}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label>
            Email:
            <br />
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <br />
            <input
              className='form-control'
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Confirm Password:
            <br />
            <input
              className='form-control'
              name='matchPassword'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <button
          className='button'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Sign Up
        </button>
      </form>
      <br />
      <button className='btn btn-primary' onClick={handleGoogleSignUp} />
    </div>
  );
}

export default SignUp;