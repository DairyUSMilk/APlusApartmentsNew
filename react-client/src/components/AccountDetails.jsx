import React from 'react';
import { useQuery } from "@apollo/client";

import { getRenter, getLandlord, getAdmin } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';
import ReviewList from './ReviewList';
import PendingReviews from './PendingReviews';
import PendingApartments from './PendingApartments';

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

    const {data: userData, loading: userLoading, error:userError }  = useQuery(query, {
        variables: {uid: uid}
    });

    if (userLoading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (userError) {
        throw new Error(error.message);
    }
    
    let data = null;
    let apartmentList = null;
    let reviewList = null;
    
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
      apartmentList =  
        userData &&
        userData.getRenterById.savedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} key={apartment.id} />;
        });
      reviewList = (<ReviewList userId={uid} accountType={accountType} />);
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
      apartmentList =  
        userData &&
        userData.getLandlordById.savedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} key={apartment.id} />;
        });
        reviewList = (<ReviewList userId={uid} accountType={accountType} />);
    }
    else if (accountType === 'admin') {
        data = (
        <div className="user">
              <h2>Admin Details</h2>
              <h3>{userData.getAdminById.name}</h3>
        </div>
      );
      apartmentList = (<PendingApartments />);
      reviewList = (<PendingReviews />);
    }

   return (
     <div className='card'>
       {data}
       <CardGroup>{apartmentList}</CardGroup>
       <CardGroup>{reviewList}</CardGroup>
   </div>
    );

}

export default AccountDetails;
