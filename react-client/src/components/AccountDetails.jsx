import React, { useState } from 'react';
import { useQuery } from "@apollo/client";

import { getRenter, getLandlord, getAdmin } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';
import ReviewList from './ReviewList';
import PendingReviews from './PendingReviews';
import PendingApartments from './PendingApartments';
import AddApartment from './AddApartment';

import CardGroup from 'react-bootstrap/CardGroup';
import { Button } from '@mui/material';


function AccountDetails({uid, accountType}) {
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);

    function toggleAddForm() {
      setIsAddFormVisible(!isAddFormVisible);    
    }

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
        variables: {id: uid}
    });

    if (userLoading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (userError) {
        throw new Error(userError);
    }
    
    let data = null;
    let apartmentList = null;
    let reviewList = null;
    
    if (accountType === 'renter') {
        data = (
        <div className="user">
              <h2>Renter Details</h2>
              <h3>{userData.getRenterById.name}</h3>
              <p>Born: {userData.getRenterById.dateOfBirth}</p>
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
              <p>Contact email: {userData.getLandlordById.contactInfo}</p>
        </div>
      );
      apartmentList =
        userData &&
        userData.getLandlordById.ownedApartments.map((apartment) => {
          console.log(apartment);
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

       {accountType === 'landlord' ? (
        <Button 
        style={{justifyContent: 'center'}}
        variant="contained"
        color="primary"
        onClick={toggleAddForm}
        >
        Create an Apartment
        </Button> ):
       null}

        {isAddFormVisible ? <AddApartment userId={uid} /> : null}

       <CardGroup>{apartmentList}</CardGroup>
       <CardGroup>{reviewList}</CardGroup>
   </div>
    );

}

export default AccountDetails;
