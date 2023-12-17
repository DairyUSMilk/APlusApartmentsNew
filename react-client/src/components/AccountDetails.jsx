import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from "@apollo/client";

import { getRenter } from '../graphql/Queries';
import { getLandlord } from '../graphql/Queries';


function AccountDetails({uid}, {accountType}) {
    let query = getRenter()
    console.log(accountType);
    if (accountType && accountType.getUserAccountType === 'landlord') {
       query = getLandlord();
    }

    const {loading: userLoading, data: userData }  = useQuery(query, {
        variables: {id: uid},
    });

    let data = null;
    
    if (userData) {
        data = (
        <div className="user">
              <h3>{userData.getRenterById.name}</h3>
              <p>{userData.getRenterById.email}</p>
              <p>{userData.getRenterById.city}</p>
              <p>{userData.getRenterById.state}</p>
              <p>{userData.getRenterById.dateOfBirth}</p>
              <p>{userData.getRenterById.gender}</p>
        </div>
      );
    }

   return (
     <div className='card'>
     <h2>Renter Details</h2>
     {userLoading ? (
       <p>Loading renter data...</p>
     ) : (
       data
     )}
   </div>
    );

}

export default AccountDetails;
