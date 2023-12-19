import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import DeleteApartment from './DeleteApartment';

function ApartmentCard({apartment, userId, accountType}) {
    return (
        <Card className="text-center">
        <Card.Body>
            <Card.Title><Link to={`/apartment/${apartment.id}`}>{apartment.name}</Link></Card.Title>
            <Card.Subtitle className="mb-2 text-muted">${apartment.price}/mo</Card.Subtitle>
            <Card.Text>
            {apartment.description}
            </Card.Text>
            {userId === apartment.landlord.id || accountType === 'admin' ? (
            <DeleteApartment apartment={apartment} />):
            null}
        </Card.Body>
        <Card.Footer className="text-muted">{apartment.address}</Card.Footer>
        </Card>
    );
}

export default ApartmentCard;