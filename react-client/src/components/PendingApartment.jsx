import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import DeleteApartment from './DeleteApartment';
import ApproveApartment from './ApproveApartment';

function PendingApartment({apartment}) {
    let amenityList = [];
    if(apartment.amenities) {
        let key = 0;
        amenityList.push((<Card.Subtitle key={key++} className="mb-2 text-muted">Amenities:</Card.Subtitle>));
        for (const amenity of apartment.amenities) {
            const amenityCard = (
            <ListGroup.Item key={key++}>{amenity}</ListGroup.Item>
            );
            amenityList.push(amenityCard);
        }
    }   

    return (
        <Card className="text-center">
        <Card.Header>{apartment.address}</Card.Header>
        <Card.Body>
            <Card.Title>{apartment.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">${apartment.price}/mo</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Landlord: <a href={`mailto:${apartment.landlord.contactInfo}`}>{apartment.landlord.name}</a></Card.Subtitle>
            <Card.Text>
            {apartment.description}
            </Card.Text>
            <ListGroup>
            {amenityList}
            </ListGroup>
        </Card.Body>
        <Card.Footer className="text-muted"> <ApproveApartment apartment={apartment} /> <DeleteApartment apartment={apartment} /></Card.Footer>
        </Card>
    );
}

export default PendingApartment;