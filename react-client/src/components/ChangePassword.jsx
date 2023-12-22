import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import {changePassword} from '../firebase/AuthFunctions';
import '../index.css';

function ChangePassword() {
  const {currentUser} = useContext(UserContext);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const submitForm = async (event) => {
    event.preventDefault();
    const {currentPassword, newPassword, matchPassword} = event.target.elements;

    if (newPassword.value !== matchPassword.value) {
        setPasswordsMatch(false);
        return false;
    }

    try {
      await changePassword(
        currentUser.email,
        currentPassword.value,
        newPassword.value
      );
      alert('Password has been changed, you will now be logged out');
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser && currentUser.providerData[0].providerId === 'password') {
    return (
      <div className='form card'>
    
        <div className="card_header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
          </svg>
          <h1 className="form_heading">{currentUser.displayName}, Please Change Your Password</h1>
        </div>
    
        {!passwordsMatch ? (
          <h4 className='error'>{'New passwords do not match'}</h4>
        ) : null}
    
        <form onSubmit={submitForm}>
          <div className='field'>
            <label htmlFor="currentPassword">
              Current Password:
              <input className="input" name='currentPassword' id='currentPassword' type='password' placeholder='Current Password' autoComplete='off' required />
            </label>
          </div>
    
          <div className='field'>
            <label htmlFor="newPassword">
              New Password:
              <input className="input" name='newPassword' id='newPassword' type='password' placeholder='Password' autoComplete='off' required />
              <div className="passwordTooltip">
                <small id="passValidations" className="passwordTooltipText">
                  Password must be a minimum of 8 characters long,
                  have at least one uppercase and lowercase character, have at least one number, 
                  and contain at least one special character (!@#$%&?).
                </small>
              </div>
            </label>
          </div>
    
          <div className='field'>
            <label htmlFor="matchPassword">
              Confirm New Password:

              <input className="input" name='matchPassword' id='matchPassword' type='password' placeholder='Confirm Password' pattern="((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&?]).{8,})" aria-describedby="passValidations" autoComplete='off' required />
            </label>
          </div>
    
          <div className="buttons-container">
            <button className='button-sign' type='submit'>
              <span>Change Password</span>
            </button>
          </div>
        </form>
    
      </div>
    );
    
  } else if (currentUser) {
    return (
      <div>
        <h2>
            Accounts created using Google authentication cannot change passwords
        </h2>
        <a href='/account' className='button-sign'>
            Back to profile page.
        </a>
      </div>
    );
  } else {
    return <Navigate to='/' />;
  }
}

export default ChangePassword;
