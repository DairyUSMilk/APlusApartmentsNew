import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {addUserDisplayName} from '../firebase/AuthFunctions';
import {Context} from '../firebase/Context';

import { useMutation } from "@apollo/client";
import { createRenter, createLandlord } from '../graphql/Mutations';

function SignUpConfigureAccount() {
  const {currentUser} = useContext(Context);
  const [accountTypeDropdownValue, setAccountTypeDropdownValue] = useState("");

  const [addRenter, { data: renterData }] = useMutation(createRenter());
  const [addLandlord, { data: landlordData }] = useMutation(createLandlord());

  const handleAccountTypeDropdownValue = (event) => {
    setAccountTypeDropdownValue(event.target.value);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {displayName, dateOfBirth, gender, city, state, accountType} = event.target.elements;
    //console.log(displayName, dateOfBirth, gender, city, state, accountType);
    try {
      if(accountType.value === 'renter') {
        console.log('here')
        addRenter({variables: {
            uid: currentUser.uid,
            email: currentUser.email,
            name: displayName.value,
            dateOfBirth: dateOfBirth.value,
            gender: gender.value,
            city: city.value,
            state: state.value
        }}
        )
        console.log('done')
      } else if (accountType.value === 'landlord') {
        addLandlord({variables: {
            uid: currentUser.uid,
            email: currentUser.email,
            name: displayName.value,
            dateOfBirth: dateOfBirth.value,
            gender: gender.value,
            city: city.value,
            state: state.value
        }}
        )
      }
      else {
        alert("Please specify account type.");
      }
      await addUserDisplayName(displayName.value);
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
          <select className={'form-group'}
              name='accountType'
              value = {accountTypeDropdownValue}
              onChange = {handleAccountTypeDropdownValue}
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