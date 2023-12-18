import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';

import { getPendingApartments } from '../graphql/Queries';
import PendingApartment from './PendingApartment';

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
        data.getPendingReviews.map((review) => {
            return <PendingApartment review={review} key={review.id} />;
        });

    return (
        <CardGroup>{apartmentList}</CardGroup>
    );
}

export default PendingApartments;