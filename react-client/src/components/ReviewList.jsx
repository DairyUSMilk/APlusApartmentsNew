import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';

import { getUserReviews } from '../graphql/Queries';
import Review from './ReviewCard';

function ReviewList({userId, accountType}) {
    const {data, loading, error }  = useQuery(getUserReviews(), {
        variables: {uid: userId}
    });

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
        data.reviews.map((review) => {
            return <Review review={review} userId={uid} accountType={accountType} key={review.id} />;
        });

    return (
        <CardGroup>{reviewList}</CardGroup>
    );
}

export default ReviewList;
