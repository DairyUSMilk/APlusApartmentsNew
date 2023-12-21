import React, {useContext} from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import DeleteApartment from './DeleteApartment';
import AddOrRemoveBookmark from './AddOrRemoveBookmark';

function ApartmentCard({apartment, inBookmark}) {
    const {userData, accountType} = useContext(UserContext);

    return (
        <Card className="text-center">
        <Card.Body>
            {accountType && userData.id !== apartment.landlord.id ? (<AddOrRemoveBookmark apartment={apartment} inBookmark={inBookmark} />): null}
            <Card.Title><Link to={`/apartment/${apartment.id}`}>{apartment.name}</Link></Card.Title>
            <Card.Subtitle className="mb-2 text-muted">${apartment.price}/mo</Card.Subtitle>
            <Card.Text>
            {apartment.description}
            </Card.Text>
            {(userData && userData.id === apartment.landlord.id) || accountType === 'admin' ? (
            <DeleteApartment apartment={apartment} />):
            null}
        </Card.Body>
        <Card.Footer className="text-muted">{apartment.address}</Card.Footer>
        </Card>
    );
}

export default ApartmentCard;