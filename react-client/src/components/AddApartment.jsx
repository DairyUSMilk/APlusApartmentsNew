import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { createApartment } from '../graphql/Mutations';

import helpers from './../utils/helpers.js';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css';


function AddApartment({userId}) {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
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
        newApartment.name=helpers.checkString(name, 'name');
        newApartment.address=helpers.checkString(address, 'address');
        newApartment.city=helpers.checkString(city, 'city');
        newApartment.state=helpers.checkState(state, 'state');
        if(description) newApartment.description=helpers.checkString(description, 'description');
        //if(images) newApartment.images=helpers.checkStringArray(images, 'images'); // todo - support images
        newApartment.price=helpers.checkNumber(Number(price), 'price');
        const allAmenities = helpers.checkString(amenities, 'amenity').split(",");
        newApartment.amenities=helpers.checkStringArray(allAmenities, 'ameneties');
        try {
            addApartment({ variables: newApartment });
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
        <Form.Group className="mb-3" controlId="apartment.name">
          <Form.Label>Name:</Form.Label>
        <Form.Control type="text" placeholder="Name" onChange={e => setName(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.address">
          <Form.Label>Address:</Form.Label>
          <Form.Control type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.city">
          <Form.Label>City:</Form.Label>
          <Form.Control type="text" placeholder="City" onChange={e => setCity(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.state">
          <Form.Label>State:</Form.Label>
          <Form.Control type="text" placeholder="State" onChange={e => setState(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.description">
          <Form.Label>Description:</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Description" onChange={e => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.images">
          <Form.Label>Images:</Form.Label>
          <Form.Control type="file" accept="image/png, image/jpeg" multiple onChange={e => setImages(e.target.files)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.price">
          <Form.Label>Price:</Form.Label>
          <Form.Control type="number"  min="0.00" step="0.01" placeholder="Price" onChange={e => setPrice(e.target.value)} required="required" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.amenities">
          <Form.Label>Amenities (separated by commas):</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Ameneties" onChange={e => setAmenities(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
}

export default AddApartment;