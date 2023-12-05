import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {createUser} from '../firebase/AuthFunctions';
import {Context} from '../firebase/Context';
import { googleSignIn } from './SignIn';

function SignUp() {
  const {currentUser} = useContext(Context);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {displayName, email, password, matchPassword} = event.target.elements;
    if (password.value !== matchPassword.value) {
      setPasswordsMatch(false);
      return false;
    }

    try {
      await createUser(
        email.value,
        password.value,
        displayName.value
      );
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
            Name:
            <br />
            <input
              className='form-control'
              required
              name='displayName'
              type='text'
              placeholder='Name'
              autoFocus={true}
            />
          </label>
        </div>
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
      <button className='btn btn-primary' onClick={() => googleSignIn()} />
    </div>
  );
}

export default SignUp;