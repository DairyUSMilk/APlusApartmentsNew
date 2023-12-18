import React from 'react';
import { useMutation } from "@apollo/client";
import { getUserReviews } from '../graphql/Queries';
import { deleteReview } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function DeleteReview ({review}) {
    const [removeReview, { loading, error }] = useMutation(deleteReview(), {
        variables: {id: review.id},
        refetchQueries: [
            { query: getUserReviews(), variables: { posterId: review.posterId }
            }
        ]
    });

    function handleDelete() {
        removeReview();
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
                <h2>Error Deleting Review! {error.message}</h2>
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