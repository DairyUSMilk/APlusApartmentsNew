import React, { useContext, useState } from 'react';
import { Link, useParams, useNavigate, useRouteError } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import ApartmentDetails from './ApartmentDetails';


import '../index.css';

function Apartment() {
    let { id } = useParams();
    const {currentUser, userData, accountType} = useContext(UserContext);

    return (
        <div>
            <h2>Apartment</h2>
            <ApartmentDetails id={id} accountType={accountType} />
        </div>
    );
}

export default Apartment;