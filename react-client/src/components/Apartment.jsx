import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams, useNavigate, useRouteError } from 'react-router-dom';
import { Context } from '../firebase/Context';
import { useQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';
import ApartmentDetails from './ApartmentDetails';


import '../index.css';

function Apartment() {
    let { id } = useParams();
    const  {currentUser} = useContext(Context);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    if (currentUser && !currentUser.displayName) {
        return <Navigate to='/sign-up-config' />;
    }

    const { data, loading, error } = useQuery(getUserAccountType(), {
        variables: {uid: currentUser.uid}
    });

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }

    if (error) {
        throw new Error(error.message);
    }

    let currentAccountType = data.getUserAccountType;

    return (
        <div>
            <h2>Apartment</h2>
            <ApartmentDetails id={id} userId={currentUser.uid} accountType={currentAccountType} />
            <Link to='/change-password' className='btn btn-primary'>
                Change Password
            </Link>
        </div>
    );
}

export default Apartment;