import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { useQuery } from '@apollo/client';
import { getRenter } from '../graphql/Queries';
import DeleteReview from './DeleteReview';
import { UserContext } from '../context/UserContext';

function Review({review}) {
    const {userData, accountType} = useContext(UserContext);
    const {data, loading, error }  = useQuery(getRenter(), {
        variables: {id: review.posterId}
    });

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }
    if (error) {
        throw new Error(error.message);
    }
    
    let poster = data.getRenterById;

    return (
        <Card className="text-center">
        <Card.Header>Rating: {review.rating}</Card.Header>
        <Card.Body>
            <Card.Title>{poster.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{review.datePosted}</Card.Subtitle>
            <Card.Text>
            {review.content}
            </Card.Text>
            {userData.id === review.posterId || accountType === 'admin' ? (
            <DeleteReview review={review} />):
            null}
        </Card.Body>
        <Card.Footer className="text-muted"><Link to={`/apartment/${review.apartmentId}`}>Apartment</Link></Card.Footer>
        </Card>
    );
}

export default Review;