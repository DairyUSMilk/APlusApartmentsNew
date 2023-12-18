import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { getRenter } from '../graphql/Queries';
import DeleteReview from './DeleteReview';
import ApproveReview from './ApproveReview';

function PendingReview({review}) {
    const {data, loading, error }  = useQuery(getRenter(), {
        variables: {uid: review.posterId}
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
        </Card.Body>
        <Card.Footer className="text-muted"> <ApproveReview review={review} /> <DeleteReview review={review} /></Card.Footer>
        </Card>
    );
}

export default PendingReview;