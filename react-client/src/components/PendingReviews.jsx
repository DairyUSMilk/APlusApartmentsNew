import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';

import { getPendingReviews } from '../graphql/Queries';
import PendingReview from './PendingReview';

function PendingReviews() {
    const {data, loading, error }  = useQuery(getPendingReviews());

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (error) {
        throw new Error(error.message);
    }

    let reviewList =  
        data &&
        data.getPendingReviews.map((review) => {
            return <PendingReview review={review} key={review.id} />;
        });

    return (
        <CardGroup>{reviewList}</CardGroup>
    );
}

export default PendingReviews;
