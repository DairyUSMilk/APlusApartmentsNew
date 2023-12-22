import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation } from "@apollo/client";
import { editRenter } from "../graphql/Mutations";
import EditRenterModal from "./EditRenterModal";
import helpers from './../utils/helpers.js';

const RenterDetails = () => {
    const [isModalVisible, setModalVisibility] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [updateRenter, {loading, error}] = useMutation(editRenter());

    const showModal = () => {
        setModalVisibility(true);
    };

    const hideModal = () => {
        setModalVisibility(false);
    }

    const updateRenterInfo = (formData) => {
        formData.id = userData.id;
        formData.dateOfBirth = helpers.reformatDateForDatabaseCall(formData.dateOfBirth);
        try{
            updateRenter({variables: formData})
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <div className="card">
            <div className="user">
              <h2>Renter Details</h2>
              <h3>{userData.name}</h3>
              <p>Born: {userData.dateOfBirth}</p>
              <p>{userData.gender}</p>
            </div>
            <div className="buttons-container">
            <button className='button-sign' onClick={showModal}>
                <span>Edit Account Info</span>
            </button>
            </div>
            <EditRenterModal
                isOpen={isModalVisible}
                closeModal={hideModal}
                callDatabaseFunction={updateRenterInfo}
                userData={userData}
            /> 
        </div>
    )
}

export default RenterDetails;
