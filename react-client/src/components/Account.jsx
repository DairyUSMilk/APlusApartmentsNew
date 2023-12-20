import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {UserContext} from '../context/UserContext';
import { useQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';

import AccountDetails from './AccountDetails';

function Account() {
    const  {currentUser} = useContext(UserContext);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    if (currentUser && !currentUser.displayName) {
        return <Navigate to='/sign-up-config' />;
    }
    
    return (
        <div>
            <AccountDetails />
            <Link to='/change-password' className='btn btn-primary'>
                Change Password
            </Link>
        </div>
    );
}

export default Account;
