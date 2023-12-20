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
    let savedApartments = null;
    let ownedApartments = null;
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
      savedApartments =  
        userData &&
        userData.getRenterById.savedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} inBookmark={true} key={apartment.id} />;
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
      savedApartments =  
        userData &&
        userData.getLandlordById.savedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} inBookmark={true} key={apartment.id} />;
        });
      ownedApartments =
        userData &&
        userData.getLandlordById.ownedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} inBookmark={false} key={apartment.id} />;
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
      savedApartments =  
      userData &&
      userData.getAdminById.savedApartments.map((apartment) => {
          return <ApartmentCard apartment={apartment} userId={uid} accountType={accountType} inBookmark={true} key={apartment.id} />;
      });
      ownedApartments = (<PendingApartments />);
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

       <CardGroup>
       <h4> Saved Apartments: </h4> <br />
       {savedApartments}
       </CardGroup>

       {ownedApartments ? (
          accountType === "landlord" ? ( 
          <h4>Owned Apartments:</h4>
          ): 
          <h4>Pending Apartments: </h4> 
          ): 
          null 
       }
       <CardGroup>{ownedApartments}</CardGroup>

       {reviewList !== 'admin' ? (
          <h4>Review History: </h4>
          ): 
          <h4>Pending Reviews: </h4> 
       }
       <CardGroup>{reviewList}</CardGroup>
   </div>
    );

}

export default AccountDetails;
