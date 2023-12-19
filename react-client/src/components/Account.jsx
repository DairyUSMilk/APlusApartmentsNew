import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../firebase/Context';
import { useQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';

import AccountDetails from './AccountDetails';

function Account() {
    const  {currentUser} = useContext(Context);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    if (currentUser && !currentUser.displayName) {
        return <Navigate to='/sign-up-config' />;
    }

    const { data, loading, error } = useQuery(getUserAccountType(), {
        variables: {id: currentUser.uid}
    });

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }

    if (error) {
        throw new Error(error);
    }

    let currentAccountType = data.getUserAccountType;
    
    return (
        <div>
            <AccountDetails uid={currentUser.uid} accountType={currentAccountType} />
            <Link to='/change-password' className='btn btn-primary'>
                Change Password
            </Link>
        </div>
    );
}

export default Account;
