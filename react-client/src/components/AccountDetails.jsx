import React, { useContext, useState } from 'react';
import {UserContext} from '../context/UserContext';
import ApartmentCard from './ApartmentCard';
import ReviewList from './ReviewList';
import PendingReviews from './PendingReviews';
import PendingApartments from './PendingApartments';
import AddApartment from './AddApartment';

import CardGroup from 'react-bootstrap/CardGroup';
import { Button } from '@mui/material';


function AccountDetails() {
    const {userData, accountType} = useContext(UserContext);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);

    function toggleAddForm() {
      setIsAddFormVisible(!isAddFormVisible);    
    }

    const savedApartments =  
      userData &&
      userData.savedApartments.map((apartment) => {
          return <ApartmentCard apartment={apartment} inBookmark={true} key={apartment.id} />;
    });

    let data = null;
    let ownedApartments = null;
    let reviewList = (<ReviewList />);
    
    if (accountType === 'renter') {
        data = (
        <div className="card-home_header">
              <h1>Renter Details</h1>
              <h2>{userData.name}</h2>
              <h4>Born: {userData.dateOfBirth}</h4>
              <p>{userData.gender}</p>
        </div>
      );
    }
    else if (accountType === 'landlord') {
        data = (
        <div className="usecard-home_headerr">
              <h1>Landlord Details</h1>
              <h2>{userData.name}</h2>
              <p>Contact email: {userData.contactInfo}</p>
        </div>
      );
      ownedApartments =
        userData &&
        userData.ownedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} inBookmark={false} key={apartment.id} />;
        });
    }
    else if (accountType === 'admin') {
        data = (
        <div className="user">
              <h2>Admin Details</h2>
              <h3>{userData.name}</h3>
        </div>
      );
      ownedApartments = (<PendingApartments />);
      reviewList = (<PendingReviews />);
    }

   return (
     <div className='form card'>
       {data}

       {accountType === 'landlord' ? (
        <div className="buttons-container">

        <Button className='button-sign'
        variant="contained"
        color="primary"
        onClick={toggleAddForm}
        >
        <span>Create An Apartment</span>
        </Button> 
        </div>
        ):
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
