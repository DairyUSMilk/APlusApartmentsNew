import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation } from "@apollo/client";
import PendingApartments from "./PendingApartments";
import CardGroup from "react-bootstrap/esm/CardGroup";
import PendingReviews from "./PendingReviews";

const AdminDetails = () => {
    const {userData, accountType} = useContext(UserContext);
    

    return (
        <div className="card">
            <div className="user">
              <h2>Admin Details</h2>
              <h3>{userData.name}</h3>
            </div>

            <div>
                <h4>Pending Apartments:</h4>
                <CardGroup>
                    <PendingApartments/>
                </CardGroup>
            </div>

            <div>
                <h4>Approved Reviews: </h4>
                <CardGroup>
                    <PendingReviews/>
                </CardGroup>
            </div>
        </div>
    )
}

export default AdminDetails;