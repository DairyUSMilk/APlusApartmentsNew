import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {Context} from '../firebase/Context';
import {logIn, googleLogIn} from '../firebase/AuthFunctions';

export const googleSignIn = async () => {
    try {
      await googleLogIn();
    } catch (error) {
      alert(error);
    }
};

function SignIn() {
  const {currentUser} = useContext(Context);
  
  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await logIn(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }
  return (
    <div>
      <div className='card'>
        <h1>Log In</h1>
        <form className='form' onSubmit={handleLogin}>
          <div className='form-group'>
            <label>
              Email Address:
              <br />
              <input
                name='email'
                id='email'
                type='email'
                placeholder='Email'
                required
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Password:
              <br />
              <input
                name='password'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <button className='button' type='submit'>
            Log in
          </button>
        </form>

        <a href='/forgot-password' className='btn btn-primary'>
            Forgot Password
        </a>

        <br />
        <div>
            <button className='btn btn-primary' onClick={() => googleSignIn()} />
        </div>      
      </div>
    </div>
  );
}

export default SignIn;