import React, { useContext, useState } from 'react';
import {UserContext} from '../context/UserContext';
import ApartmentCard from './ApartmentCard';
import ReviewList from './ReviewList';
import PendingReviews from './PendingReviews';
import PendingApartments from './PendingApartments';
import AddApartment from './AddApartment';

import CardGroup from 'react-bootstrap/CardGroup';
import { Button } from '@mui/material';
import EditRenterModal from './EditRenterModal.jsx';
import { useMutation } from "@apollo/client";
import { editRenter, createApartment, editLandlord } from '../graphql/Mutations.js';
import CreateApartmentModal from './CreateApartmentModal.jsx';
import EditLandlordModal from './EditLandlordModal.jsx';



function AccountDetails() {
    const [isRenterModalOpen, setIsRenterModalOpen] = useState(false);
    const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
    const [isAddApartmentModalOpen, setIsAddApartmentModalOpen] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [updateRenter] = useMutation(editRenter());
    const [updateLandlord] = useMutation(editLandlord());
    const [addApartmentCall] = useMutation(createApartment());

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

    const updateLandlordInfo = (formData) => {
        formData.id = userData.id;
        console.log(JSON.stringify(formData));
        try{
            updateLandlord({variables: formData});
        } catch(e){
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

    const openLandlordModal = () => {
        setIsLandlordModalOpen(true);
    }

    const closeLandlordModal = () => {
        setIsLandlordModalOpen(false);
    }

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
              <h1>Admin Details</h1>
              <h2>{userData.name}</h2>
        </div>
      );
      ownedApartments = (<PendingApartments />);
      reviewList = (<PendingReviews />);
    }

   return (
     <div className='form card'>
       {data}
       {accountType === "landlord" ? 
        <>
            <div className="buttons-container">
            <button className='button-sign' onClick={openAddApartmentModal}>
                <span>Add Apartment Listing</span>
            </button>
            </div>
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

       {accountType === "renter" ? 
       <>

        <div className="buttons-container">
        <button className='button-sign' onClick={openEditRenterModal}>
            <span>Edit Account Info</span>
        </button>
        </div>

        <EditRenterModal
            isOpen={isRenterModalOpen}
            closeModal={closeEditRenterModal}
            callDatabaseFunction={updateAccountInfo}
            userData={userData}
        /> 
       </> : <br></br>
        }

        {accountType === "landlord" ? 
            <>
                <div className="buttons-container">
                <button className='button-sign' onClick={openEditRenterModal}>
                <span>Edit Account Info</span>
                </button>
                </div>
                <EditLandlordModal
                    isOpen={isLandlordModalOpen}
                    closeModal={closeLandlordModal}
                    callDatabaseFunction={updateLandlordInfo}
                    userData={userData}
                />
            </> :
            <></>

        }

   </div>
    );

}

export default AccountDetails;
