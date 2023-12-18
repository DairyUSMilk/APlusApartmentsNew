import React, { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client";
import { createApartment } from '../graphql/Mutations';

import helpers from './../utils/helpers.js';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css';


function AddApartment({userId}) {
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(null);
    const [price, setPrice] = useState(0);
    const [amenities, setAmenities] = useState('');

    const [addApartment, { loading, error }] = useMutation(createApartment());

    const handleAdd = (event) => {
        event.preventDefault();
        let newApartment = {
            landlordId: userId
        };
        if(address) newApartment.address=helpers.checkString(address);
            else throw new Error("Please add apartment address.");
        if(description) newApartment.address=helpers.checkString(description);
        if(images) newApartment.address=helpers.checkStringArray(images);
        if(price) newApartment.price=helpers.checkNumber(price);
            else throw new Error("Please add montly rent price.");
        if(amenities) {
            const allAmenities = helpers.checkString(amenities).split(",");
            newApartment.amenities=helpers.checkStringArray(allAmenities);
        }
        else throw new Error("Please add apartment amenities.");
        try {
            addApartment({ variables: newApartment });
            alert("Apartment added and pending admin approval.");
        }
        catch (e) {
            alert(e);
        }
    };

    if (loading) { 
        return (
        <div>
            <h2>Adding Apartment....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Adding Apartment! {error.message}</h2>
            </div>
        );
    }

    return (
        <Form onSubmit={handleAdd}>
        <Form.Group className="mb-3" controlId="apartment.rating">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.textarea">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Description" onChange={e => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.images">
          <Form.Label>Images:</Form.Label>
          <Form.Control type="file" accept="image/png, image/jpeg" multiple onChange={e => setImages(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.rating">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number"  min="0.00" step="0.01" placeholder="Price" onChange={e => setPrice(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.textarea">
          <Form.Label>Amenities (separated by commmas):</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Ameneties" onChange={e => setAmenities(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
}

export default AddApartment;