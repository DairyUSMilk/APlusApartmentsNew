import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import {logIn, googleLogIn} from '../firebase/AuthFunctions';
import '../index.css';

export const googleSignIn = async () => {
    try {
      await googleLogIn();
    } catch (error) {
      alert(error);
    }
};

function SignIn() {
  const {currentUser} = useContext(UserContext);
  
  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await logIn(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  console.log(currentUser)
  if (currentUser) {
    console.log('here')
    return <Navigate to='/' />;
  }
  return (
      <div className='form card'>
        
        <div className="card_header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
        </svg>
        <h1 className="form_heading">Sign In</h1>
      </div>

        <form className='form' onSubmit={handleLogin}>
          <div className='field'>
              <label htmlFor="email">
              Email:
              <br />
              <input className="input" required name="email" type="email" placeholder="Email" id="email" />
            </label>
          </div>
          <div className='field'>
              <label htmlFor="password">
              Password:
              <br />
              <input className="input" id="password" name="password" type="password" placeholder="Password" autoComplete="off" required />
            </label>
          </div>
          <br/>

          <div className="buttons-container">

          <button className='button-sign' type='submit'>
          <span>Log in</span>
          </button>

        <a href='/forgot-password' className='button-forget' >
          <span>Forgot Password</span>
        </a>

          <button className='button-sign' onClick={() => googleSignIn()}>
          <span>Sign in</span>
          </button>
    
        </div>
      </form>
      </div>
  );
}

export default SignIn;

