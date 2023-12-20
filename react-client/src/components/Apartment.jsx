import React, { useContext, useState } from 'react';
import { Link, useParams, useNavigate, useRouteError } from 'react-router-dom';
import { Context } from '../firebase/Context';
import { useQuery } from "@apollo/client";

import { getUserAccountType } from '../graphql/Queries';
import ApartmentDetails from './ApartmentDetails';


import '../index.css';

function Apartment() {
    let { id } = useParams();
    const {currentUser} = useContext(Context);
    const [uid] = useState(currentUser ? currentUser.uid : null);
  
    const { data, loading, error } = useQuery(getUserAccountType(), {
      variables: { id: uid },
      skip: !currentUser || !currentUser.displayName
    });

    let accountType;
    if(data) {
      accountType = data.getUserAccountType;
    }

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }

    if (error) {
        throw new Error(error.message);
    }

    return (
        <div>
            <h2>Apartment</h2>
            <ApartmentDetails id={id} userId={uid} accountType={accountType} />
        </div>
    );
}

export default Apartment;