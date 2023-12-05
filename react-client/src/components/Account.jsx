import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {Context} from '../firebase/Context';

function Account() {
    const {currentUser} = useContext(Context);
    if (currentUser) {
        return (
          <div>
            <h2>
                Account page -- TODO: show user account details
            </h2>
            <ul>
                <li>
                <p>For renters - list all bookmarked apartments (with links) + all their reviews </p>
                </li>
                <li>
                <p>Add delete button to each review in the list</p>
                </li>
                <li>
                <p>For landlords - list all their building listings (with links) + options to edit/delete the listings </p>
                </li>
                <li>
                <p>For admins - list all submitted applications for building listings + user reviews </p>
                </li>
                <li>
                <p>Admins can approve/deny each application </p>
                </li>
            </ul>

            <a href='/change-password' className='btn btn-primary'>
            Change Password
            </a>
    
          </div>
        );
    } else {
        return <Navigate to='/' />;
    }
}
    
export default Account;