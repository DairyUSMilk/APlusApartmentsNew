import React from 'react';
import { useQuery } from "@apollo/client";

import { getRenter } from '../graphql/Queries';
import { getLandlord } from '../graphql/Queries';
import { getAdmin } from '../graphql/Queries';

function AccountDetails({uid, accountType}) {
    console.log(uid, accountType)
    let query = null;
    if (accountType === 'renter') {
        query = getRenter();
    }
    else if (accountType === 'landlord') {
       query = getLandlord();
    }
    else if (accountType === 'admin') {
        query = getAdmin();
    }
    else {
        throw new Error("Invalid account type. Are you sure you're correcly signed in?")
    }

    const {data: userData, loading, error }  = useQuery(query, {
        variables: {uid: uid}
    });

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (error) {
        throw new Error(error.message);
    }
    
    let data = null;
    
    if (accountType === 'renter') {
        data = (
        <div className="user">
              <h2>Renter Details</h2>
              <h3>{userData.getRenterById.name}</h3>
              <p>{userData.getRenterById.email}</p>
              <p>{userData.getRenterById.city}</p>
              <p>{userData.getRenterById.state}</p>
              <p>{userData.getRenterById.dateOfBirth}</p>
              <p>{userData.getRenterById.gender}</p>
        </div>
      );
    }
    else if (accountType === 'landlord') {
        data = (
        <div className="user">
              <h2>Landlord Details</h2>
              <h3>{userData.getLandlordById.name}</h3>
              <p>{userData.getLandlordById.contactInfo}</p>
              <p>{userData.getLandlordById.city}</p>
              <p>{userData.getLandlordById.state}</p>
              <p>{userData.getLandlordById.dateOfBirth}</p>
              <p>{userData.getLandlordById.gender}</p>
        </div>
      );
    }
    else if (accountType === 'admin') {
        data = (
        <div className="user">
              <h2>Admin Details</h2>
              <h3>{userData.getAdminById.name}</h3>
        </div>
      );
    }

    console.log(userData)

   return (
     <div className='card'>
     {userLoading ? (
       <p>Loading renter data...</p>
     ) : (
       data
     )}
   </div>
    );

}

export default AccountDetails;
