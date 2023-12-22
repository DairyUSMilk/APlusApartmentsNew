import React, {useContext, useState} from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { addUserDisplayName } from '../firebase/AuthFunctions';
import { UserContext } from '../context/UserContext';

import { useMutation } from "@apollo/client";
import { createRenter, createLandlord, createAdmin } from '../graphql/Mutations';

function SignUpConfigureAccount() {
  const navigate = useNavigate();
  const {currentUser, userData} = useContext(UserContext);
  const [accountTypeDropdownValue, setAccountTypeDropdownValue] = useState("");

  const [addRenter] = useMutation(createRenter());
  const [addLandlord] = useMutation(createLandlord());
  const [addAdmin] = useMutation(createAdmin());

  const handleAccountTypeDropdownValue = (event) => {
    setAccountTypeDropdownValue(event.target.value);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    let {displayName, dateOfBirth, gender, city, state, accountType} = event.target.elements;
    const date = new Date(dateOfBirth.value);
    date.setDate(date.getDate() + 1);
    const formattedDob = (date.getMonth()+1) + '/' + (date.getDate()) + '/' + date.getFullYear();

    try {
      if(accountType.value === 'renter') {
        addRenter({variables: {
            id: currentUser.uid,
            email: currentUser.email,
            name: displayName.value,
            dateOfBirth: formattedDob,
            gender: gender.value,
            city: city.value,
            state: state.value
        }}
        );
      } else if (accountType.value === 'landlord') {
        addLandlord({variables: {
            id: currentUser.uid,
            email: currentUser.email,
            name: displayName.value,
            dateOfBirth: formattedDob,
            gender: gender.value,
            city: city.value,
            state: state.value
        }}
        )
      }
      else if (accountType.value === 'admin') {
        addAdmin({variables: {
            id: currentUser.uid,
            email: currentUser.email,
            name: displayName.value,
            dateOfBirth: formattedDob,
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
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  if (!currentUser) {
    return <Navigate to='/sign-up' />;
  }

  if (userData) {
    return <Navigate to='/account' />;
  }

  return (
    <div className='form card'>
  
      <div className="card_header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
        </svg>
        <h1 className="form_heading">Set Up Account</h1>
      </div>
  
      <form onSubmit={handleSignUp}>
        <div className='field'>
          <label htmlFor="displayName">
            Name:
            <input className="input" required name='displayName' type='text' placeholder='Name' autoFocus={true} />
          </label>
        </div>
  
        <div className='field'>
          <label htmlFor="dateOfBirth">
            Date of Birth:
            <input className="input" required name='dateOfBirth' type='date' />
          </label>
        </div>
  
        <div className='field'>
          <label htmlFor="gender">
            Gender:
            <select className="input" name="gender" id="gender" required>
              <option value="">-Select Gender-</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
  
        <div className='field'>
          <label htmlFor="city">
            City:
            <input className="input" name='city' type='text' placeholder='City' autoComplete='off' required />
          </label>
        </div>
  
        <div className='field'>
          <label htmlFor="state">
            State:
            <input className="input" name='state' type='text' placeholder='State' autoComplete='off' required />
          </label>
        </div>
  
        <div className='field'>
          <label htmlFor="accountType">
            Account Type:
            <select className="input" name='accountType' value={accountTypeDropdownValue} onChange={handleAccountTypeDropdownValue} required>
              <option value="">-Select Account Type-</option>
              <option value="renter">Renter</option>
              <option value="landlord">Landlord</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
  
        <br/>
        <br/>

        <div className="buttons-container">
          <button className='button-sign' id='submitButton' name='submitButton' type='submit'>
            <span>Sign Up</span>
          </button>
        </div>
      </form>
    </div>
  );
  
}

export default SignUpConfigureAccount;
