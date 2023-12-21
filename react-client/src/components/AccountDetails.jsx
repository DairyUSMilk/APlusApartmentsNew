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
import { editRenter } from '../graphql/Mutations.js';



function AccountDetails() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [updateRenter, {loading, error}] = useMutation(editRenter());

    function toggleAddForm() {
      setIsAddFormVisible(!isAddFormVisible);    
    }
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
    setIsModalOpen(false);
    };

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

       {accountType === 'landlord' ? (
        <Button 
            style={{justifyContent: 'center'}}
            variant="contained"
            color="primary"
            onClick={toggleAddForm}>
            Create an Apartment
        </Button> ):
       null}

       {isAddFormVisible ? <AddApartment /> : null}

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
        <button onClick={openModal}>Edit Account Info</button>
        <EditRenterModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            callDatabaseFunction={updateAccountInfo}
            userData={userData}
        /> 
       </> : <br></br>
    }
   </div>
    );

}

export default AccountDetails;
