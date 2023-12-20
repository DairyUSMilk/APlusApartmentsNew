import React from 'react';
import { useQuery } from "@apollo/client";
import { getPendingApartments } from '../graphql/Queries';
import PendingApartment from './PendingApartment';

import CardGroup from 'react-bootstrap/CardGroup';

function PendingApartments() {
    const {data, loading, error } = useQuery(getPendingApartments());

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (error) {
        throw new Error(error.message);
    }

    let apartmentList =  
        data &&
        data.pendingApartments.map((apartment) => {
            return <PendingApartment apartment={apartment} key={apartment.id} />;
        });

    return (
        <CardGroup>
        {apartmentList}
        </CardGroup>
    );
}

export default PendingApartments;