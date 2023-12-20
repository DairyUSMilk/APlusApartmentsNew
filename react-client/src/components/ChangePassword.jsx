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
      <div>
        {!passwordsMatch ? (
            <h4 className='error'>{'New passwords do not match'}</h4>
        ) : null}
        <h2>{currentUser.displayName}, Change Your Password Below</h2>
        <form onSubmit={submitForm}>
          <div className='form-group'>
            <label>
              Current Password:
              <input
                className='form-control'
                name='currentPassword'
                id='currentPassword'
                type='password'
                placeholder='Current Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <div className='form-group'>
            <label>
              New Password:
              <input
                className='form-control'
                name='newPassword'
                id='newPassword'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Confirm New Password:
              <input
                className='form-control'
                name='matchPassword'
                id='matchPassword'
                type='password'
                placeholder='Confirm Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <button className='button' type='submit'>
            Change Password
          </button>
        </form>
        <br />
      </div>
    );
  } else if (currentUser) {
    return (
      <div>
        <h2>
            Accounts created using Google authentication cannot change passwords
        </h2>
        <a href='/account' className='btn btn-primary'>
            Back to profile page.
        </a>
      </div>
    );
  } else {
    return <Navigate to='/' />;
  }
}

export default ChangePassword;