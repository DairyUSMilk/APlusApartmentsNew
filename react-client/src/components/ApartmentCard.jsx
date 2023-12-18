import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import DeleteApartment from './DeleteApartment';

function ApartmentCard({apartment, userId, accountType}) {
    return (
        <Card className="text-center">
        <Card.Img variant="top" src={apartment.images.length > 0 ? (apartment.images[0]): '/no-image.png'} />
        <Card.Body>
            <Card.Title>${apartment.price}/mo</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{apartment.address}</Card.Subtitle>
            <Card.Text>
            {review.content}
            </Card.Text>
            {userId === apartment.landlord.uid || accountType === 'admin' ? (
            <DeleteApartment apartment={apartment} />):
            null}
        </Card.Body>
        <Card.Footer className="text-muted"><Link to={`/apartment/${apartment.landlord.uid}`}>Apartment</Link></Card.Footer>
        </Card>
    );
}

export default ApartmentCard;