import ApartmentCard from './ApartmentCard';
import UserReviewList from './ReviewList';
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import {UserContext} from '../context/UserContext';
import CreateApartmentModal from "./CreateApartmentModal";
import EditLandlordModal from "./EditLandlordModal";
import { createApartment, editLandlord } from '../graphql/Mutations.js';
import CardGroup from 'react-bootstrap/esm/CardGroup';

const LandlordDetails = () => {
    const [isEditModalVisible, setEditModalVisibility] = useState(false);
    const [isAddModalVisible, setAddModalVisibility] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [updateLandlord, {loading, error}] = useMutation(editLandlord());
    const [addApartmentCall] = useMutation(createApartment());
    const showEditModal = () => {
        setEditModalVisibility(true);
    }

    const hideEditModal = () => {
        setEditModalVisibility(false);
    }

    const showAddModal = () => {
        setAddModalVisibility(true);
    }

    const hideAddModal = () => {
        setAddModalVisibility(false);
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
    let reviewList = (<UserReviewList />);
    let ownedApartments =
        userData &&
        userData.ownedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} inBookmark={false} key={apartment.id} />;});

    return (
        <div className="card">
            <div className="user">
              <h2>Landlord Details</h2>
              <h3>{userData.name}</h3>
              <p>Contact email: {userData.contactInfo}</p>
            </div>

            <div>
                <div className="buttons-container">
                <button className='button-sign' onClick={showAddModal}>
                    <span>Add Apartment Listing</span>
                </button>
                </div>
                <CreateApartmentModal 
                    isOpen={isAddModalVisible}
                    closeModal={hideAddModal}
                    callDatabaseFunction={addApartment}/>
            </div>

            <h4>Approved Apartments:</h4>
            <CardGroup>{ownedApartments}</CardGroup>
            <CardGroup>{reviewList}</CardGroup>

            <div>
                <div className="buttons-container">
                <button className='button-sign' onClick={showEditModal}>
                    <span>Edit Account Info</span>
                </button>
                </div>
                    <EditLandlordModal
                        isOpen={isEditModalVisible}
                        closeModal={hideEditModal}
                        callDatabaseFunction={updateLandlordInfo}
                        userData={userData}
                    />
            </div>
        </div>
    )

}

export default LandlordDetails;
