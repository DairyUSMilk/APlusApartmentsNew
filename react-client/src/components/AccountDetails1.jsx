import React, { useContext, useState } from 'react';
import {UserContext} from '../context/UserContext';
import ApartmentCard from './ApartmentCard';
import CardGroup from 'react-bootstrap/CardGroup';
import LandlordDetails from './LandlordDetails';
import RenterDetails from './RenterDetails';
import AdminDetails from './AdminDetails';



function AccountDetails1() {
    const {userData, accountType} = useContext(UserContext);

    const savedApartments =  
      userData &&
      userData.savedApartments.map((apartment) => {
          return <ApartmentCard apartment={apartment} inBookmark={true} key={apartment.id} />;
    });

    let userDetails = null;
    if(accountType === "renter"){
        userDetails = <RenterDetails/>
    } else if(accountType === "landlord"){
        userDetails = <LandlordDetails/>
    } else{
        userDetails = <AdminDetails/>
    }
   return (
     <div className='card'>


       <CardGroup>
       <h4> Saved Apartments: </h4> <br />
       {savedApartments}
       </CardGroup>

       {userDetails}
    
   </div>);

}

export default AccountDetails1;
