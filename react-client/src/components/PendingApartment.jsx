import React from 'react';
import Card from 'react-bootstrap/Card';

import DeleteApartment from './DeleteApartment';
import ApproveApartment from './ApproveApartment';

function PendingApartment({apartment}) {
    return (
        <div>
            <Card
                variant='outlined'
                sx={{
                    maxWidth: 550,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    border: '1px solid #1e8678',
                    boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                }}
            >
                <CardHeader
                    title={(apartment.address || '')}
                    sx={{
                        borderBottom: '1px solid #1e8678',
                        fontWeight: 'bold'
                    }}
                />
                <CardMedia
                   component={'div'} 
                />
                {ApartmentImages(apartment)}
                <CardContent>
                    <Typography
                        variant='body2'
                        color='textSecondary'
                        sx={{
                            borderBottom: '1px solid #1e8678',
                            fontWeight: 'bold'
                        }}
                    >
                                <br/>
                                <h4>{apartment.address}</h4>
                                <h4>${apartment.price}/mo</h4> 
                                    {apartment && apartment.description ? (
                                        <span>
                                            <span>{apartment.description}</span>
                                        </span>
                                    ) : (
                                        <span>No Description</span>
                                    )}  
                                    
                                    <br /><br />
                                    Amenities:
                                    {amenityList.length > 0 ? (
                                        <span>
                                            <span>{amenityList}</span>
                                        </span>
                                    ) : (
                                        <span>N/A</span>
                                    )}     
                                    <br /><br />
                                    <h4>Landlord:</h4> 
                                    {apartment.landlord.name}      
                        </Typography>
                    </CardContent>
                    <ApproveApartment apartment={apartment} />
                    <DeleteApartment apartment={apartment} />
                </Card>
                <CardGroup>{reviewList}</CardGroup>
            </div>
    );
}

export default PendingApartment;