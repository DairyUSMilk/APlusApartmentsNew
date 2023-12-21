import React from 'react';
import { useMutation } from "@apollo/client";
import { getPendingReviews } from '../graphql/Queries';
import { approveReview } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function ApproveReview ({review}) {
    const [acceptReview, { loading, error }] = useMutation(approveReview(), {
        variables: {id: review.id},
        refetchQueries: [
            { query: getPendingReviews() }
        ]
    });

    function handleApprove() {
        acceptReview();
    }
    
    if (loading) { 
        return (
        <div>
            <h2>Accepting Review....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Accepting Review! {error.message}</h2>
            </div>
        );
    }
     
    return (
        <Button 
            variant="primary"
            onClick={handleApprove}
            >
            Approve
        </Button>
        );
    }
    
    export default ApproveReview;