import React, { useContext, useState } from 'react';
import {UserContext} from '../context/UserContext';
import ApartmentCard from './ApartmentCard';
import UserReviewList from './ReviewList';
import PendingReviews from './PendingReviews';
import PendingApartments from './PendingApartments';
import AddApartment from './AddApartment';
import helpers from './../utils/helpers.js';
import CardGroup from 'react-bootstrap/CardGroup';
import { Button } from '@mui/material';
import EditRenterModal from './EditRenterModal.jsx';
import { useMutation } from "@apollo/client";
import { editRenter, createApartment } from '../graphql/Mutations.js';
import CreateApartmentModal from './CreateApartmentModal.jsx';



function AccountDetails() {
    const [isRenterModalOpen, setIsRenterModalOpen] = useState(false);
    const [isAddApartmentModalOpen, setIsAddApartmentModalOpen] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [updateRenter, {loading, error}] = useMutation(editRenter());
    const [addApartmentCall, { loading1, error1 }] = useMutation(createApartment());

    const updateAccountInfo = (formData) => {
        formData.id = userData.id;
        formData.dateOfBirth = helpers.reformatDateForDatabaseCall(formData.dateOfBirth);
        try{
            updateRenter({variables: formData})
        }
        catch(e){
            console.log(e);
        }
    }

    const addApartment = (formData) => {
        formData.landlordId = userData.id;
        if(formData.amenities){
            formData.amenities = formData.amenities.split(",");
        }
        if(formData.price){
            formData.price = Number(formData.price)
        }
        try{
            addApartmentCall({ variables: formData });
        }catch(e){
            console.log(e);
        }
    }

    const openEditRenterModal = () => {
        setIsRenterModalOpen(true);
    };

    const closeEditRenterModal = () => {
        setIsRenterModalOpen(false);
    };

    const openAddApartmentModal = () => {
        setIsAddApartmentModalOpen(true);
    }

    const closeAddApartmentModal = () => {
        setIsAddApartmentModalOpen(false);
    }

    const savedApartments =  
      userData &&
      userData.savedApartments.map((apartment) => {
          return <ApartmentCard apartment={apartment} inBookmark={true} key={apartment.id} />;
    });

    let data = null;
    let ownedApartments = null;
    let reviewList = (<UserReviewList />);
    
    if (accountType === 'renter') {
        data = (
        <div className="user">
              <h2>Renter Details</h2>
              <h3>{userData.name}</h3>
              <p>Born: {userData.dateOfBirth}</p>
              <p>{userData.gender}</p>
        </div>
      );
    }
    else if (accountType === 'landlord') {
        data = (
        <div className="user">
              <h2>Landlord Details</h2>
              <h3>{userData.name}</h3>
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
     <div className='card'>
       {data}

       {accountType === "landlord" ? 
        <>
            <button onClick={openAddApartmentModal}>Add Apartment Listing</button>
            <CreateApartmentModal 
                isOpen={isAddApartmentModalOpen}
                closeModal={closeAddApartmentModal}
                callDatabaseFunction={addApartment}/>
        </> :
        <></>
    
        }

       <CardGroup>
       <h4> Saved Apartments: </h4> <br />
       {savedApartments}
       </CardGroup>

       {ownedApartments ? (
          accountType === "landlord" ? ( 
          <h4>Approved Apartments:</h4>
          ): 
          <h4>Pending Apartments: </h4> 
          ): 
          null 
       }
       <CardGroup>{ownedApartments}</CardGroup>

       {accountType !== 'admin' ? (
          <h4>Approved Reviews: </h4>
          ): 
          <h4>Pending Reviews: </h4> 
       }
       <CardGroup>{reviewList}</CardGroup>
       {accountType === "renter" ? 
       <>
        <button onClick={openEditRenterModal}>Edit Account Info</button>
        <EditRenterModal
            isOpen={isRenterModalOpen}
            closeModal={closeEditRenterModal}
            callDatabaseFunction={updateAccountInfo}
            userData={userData}
        /> 
       </> : <br></br>
    }
   </div>
    );

}

export default AccountDetails;
