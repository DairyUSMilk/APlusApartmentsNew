import React, {useContext} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {Context} from '../firebase/Context';
import {resetPassword} from '../firebase/AuthFunctions';
import { googleSignIn } from './SignIn';

function ForgotPassword() {
    const {currentUser} = useContext(Context);
    
    const passwordReset = (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        if (email) {
          resetPassword(email);
          alert('Password reset email was sent');
        } else {
          alert(
            'Please enter an email address below before you click the forgot password link'
          );
        }
      };
    
    if (currentUser) {
      return <Navigate to='/' />;
    }

    return (
      <div>
        <div className='card'>
          <form className='form' onSubmit={passwordReset}>
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
            
            <button className='button' type='submit' >
              Send Reset Email
            </button>
          </form>
  
          <br />
          <div>
              <button className='btn btn-primary' onClick={() => googleSignIn()}>
                Sign in with Google
              </button>
          </div>      
        </div>
      </div>
    );
}
  
export default ForgotPassword;

