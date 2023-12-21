import React from 'react';
import { useMutation } from "@apollo/client";
import { getUserReviews } from '../graphql/Queries';
import { deleteReview } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function DeleteReview ({review}) {
    console.log(review.id);
    const [removeReview, { loading, error }] = useMutation(deleteReview(), {
        variables: {id: review.id}
    });

    function handleDelete() {
        removeReview();
        navigate(0);
    }
    
    if (loading) { 
        return (
        <div>
            <h2>Deleting Review....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Deleting Review! {error}</h2>
            </div>
        );
    }
     
    return (
        <Button 
            variant="primary"
            onClick={handleDelete}
            >
            Delete
        </Button>
        );
    }
    
    export default DeleteReview;