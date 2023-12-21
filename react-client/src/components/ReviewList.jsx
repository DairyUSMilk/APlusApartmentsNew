import React, {useContext} from 'react';
import { UserContext } from '../context/UserContext';
import { useQuery } from "@apollo/client";

import CardGroup from 'react-bootstrap/CardGroup';

import { getUserReviews } from '../graphql/Queries';
import Review from './ReviewCard';

function UserReviewList() {
    const {userData} = useContext(UserContext);
    const {data, loading, error }  = useQuery(getUserReviews(), {
        variables: {posterId: userData.id}
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
            return <Review review={review} key={review.id} />;
        });

    return (
        <CardGroup>{reviewList}</CardGroup>
    );
}

export default UserReviewList;
