import React from 'react';
import { useQuery } from "@apollo/client";

import { getRenter } from '../graphql/Queries';
import { getLandlord } from '../graphql/Queries';
import { getAdmin } from '../graphql/Queries';

function AccountDetails({uid}, {accountType}) {
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

    const {loading: userLoading, data: userData }  = useQuery(query, {
        variables: {id: uid}
    });

    let data = null;
    
    if (userData && accountType === 'renter') {
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

    else if (userData && accountType === 'landLord') {
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

    if (userData && accountType === 'admin') {
        data = (
        <div className="user">
              <h2>Admin Details</h2>
              <h3>{userData.getAdminById.name}</h3>
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
