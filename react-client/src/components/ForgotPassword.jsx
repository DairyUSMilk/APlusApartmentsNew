import React, {useContext} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import {resetPassword} from '../firebase/AuthFunctions';
import { googleSignIn } from './SignIn';

function ForgotPassword() {
    const {currentUser} = useContext(UserContext);
    
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
        <div className='form card'>
          <form className='form' onSubmit={passwordReset}>
            <div className='form-group'>
              <label>
                Email Address:
                <br/>
                <br/>
                <input className="input" required name="email" type="email" placeholder="Email" id="email" />
              </label>
            </div>

            <br/>
            <div className="buttons-container">

            <button className='button-sign' type='submit' >
            <span>Send Reset Email</span>
            </button>
  
          <div>
              <button className='button-sign' onClick={() => googleSignIn()}>
                <span>Sign in with Google</span>
              </button>
          </div>  
          </div>  

          </form>
    
        </div>
      </div>
    );
}
  
export default ForgotPassword;

