import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {addUserDisplayName} from '../firebase/AuthFunctions';
import {Context} from '../firebase/Context';

import { createUser } from '../graphql/Mutations';

function SignUpConfigureAccount() {
  const [addUser, { loading, error }] = useMutation(createUser(currentUser.uid));
  const {currentUser} = useContext(Context);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {displayName, dateOfBirth, city, state, accountType} = event.target.elements;

    try {
      await addUserDisplayName(displayName.value);
      addUser();

    } catch (error) {
      alert(error);
    }
  };

  if ((currentUser && currentUser.displayName)) {
    return <Navigate to='/' />;
  }

  if (!currentUser) {
    return <Navigate to='sign-up' />;
  }

  return (
    <div className='card'>
      <h1>Set Up Account</h1>
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
        <br />
        <div className='form-group'>
          <label>
            Date of Birth:
            <br />
            <input
              className='form-control'
              required
              name='dateOfBirth'
              type='date'
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            Gender:
            <br />
            <select name="gender" id="gender" required>
                <option value="">-Select Gender-</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            City:
            <br />
            <input
              className='form-control'
              name='city'
              type='text'
              placeholder='City'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            State:
            <br />
            <input
              className='form-control'
              name='state'
              type='text'
              placeholder='State'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
          Account Type:
          </label>
          <br />
          <select className={'drop-item drop-select'}
              name='dropdown'
              value = {dropdownValue}
              onChange = {handleDropdownValue}
              required>
              <option className={'drop-item drop-main'} value='main'>
                -Select Account Type-
              </option>
              <option value="renter">
                Renter
              </option>
              <option value="landlord">
                Landlord
              </option>
              <option value="admin">
                Admin
              </option>
            </select>
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
    </div>
  );
}

export default SignUpConfigureAccount;