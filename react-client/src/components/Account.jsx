import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../firebase/Context';

import AccountDetails from './AccountDetails';

function Account() {
    const { currentUser, userAccountType } = useContext(Context);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    if (!userAccountType) {
        return <Navigate to='sign-up-config' />;
    }

    return (
        <div>
            <h2>Account Page</h2>
            <AccountDetails uid = {currentUser.uid} accountType = {userAccountType} />

            <Link to='/change-password' className='btn btn-primary'>
                Change Password
            </Link>
        </div>
    );
}

export default Account;
