import React, { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client";
import { getUserReviews } from '../graphql/Queries';
import { createReview } from '../graphql/Mutations';

import helpers from './../utils/helpers.js';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css';


function AddReview({posterId, apartmentId}) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const [addReview, { loading, error }] = useMutation(createReview());

    const handleAdd = (event) => {
        event.preventDefault();
        let date = new Date();
        let newReview = {
            posterId: posterId,
            apartmentId: apartmentId,
            datePosted: ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
        };
        if(rating) newReview.rating=helpers.checkWholeNumber(Number(rating));
        else throw new Error("Please add a rating.");
        if(content) newReview.content=helpers.checkString(content);

        console.log(newReview);
        try {
            addReview({ variables: newReview });
        }
        catch (e) {
            alert(e);
        }
    };

    if (loading) { 
        return (
        <div>
            <h2>Adding Review....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Adding Review! {error.message}</h2>
            </div>
        );
    }

    return (
        <Form onSubmit={handleAdd}>
        <Form.Group className="mb-3" controlId="review.rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control type="number" min="0" max="5" step="1" placeholder="Rating" onChange={e => setRating(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="review.textarea">
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Content" onChange={e => setContent(e.target.value)} />
        </Form.Group>
  
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
}

export default AddReview;