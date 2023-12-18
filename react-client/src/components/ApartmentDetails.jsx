import React, {useState} from 'react';
import { Link, Navigate, useParams, useNavigate, useRouteError } from 'react-router-dom';
import { ImageList, ImageListItem } from '@mui/material';
import { useQuery } from "@apollo/client";

import { getApartment } from '../graphql/Queries';
import Review from './ReviewCard';
import AddReview from './AddReview';
import DeleteApartment from './DeleteApartment';

import CardGroup from 'react-bootstrap/CardGroup';
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader
} from '@mui/material';
import '../index.css';

function ApartmentDetails({id, userId, accountType}) {
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const navigate = useNavigate();

    const {data, loading, error }  = useQuery(getApartment(), {
        variables: {id: id}
    });

    function toggleAddForm() {
        setIsAddFormVisible(!isAddFormVisible);    
    }

    function ApartmentImages(apartment) {
        return (
            <ImageList
            sx={{ width: 500, height: 450 }}
            variant="quilted"
            cols={4}
            rowHeight={120}
          >
            {apartment.images.map((img) => (
                <ImageListItem key={apartment.images.indexOf(img)} cols={1} rows={1}>
                <img
                    src={`${img}?w=${1}&h=${1}&fit=crop&auto=format`}
                    alt={`Apartment Image ${apartment.images.indexOf(img)}`}
                    loading="lazy"
                />
                </ImageListItem>
            ))}
            </ImageList>
        );
    }

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }

    if (error) {
        throw new Error(error.message);
    }

    let apartment = data.getApartmentById;

    let amenityList = [];
    if(apartment.amenities) {
        for (const amenity of apartment.amenities) {
            const amenityCard = (
            <span>
                <span>{amenity}</span>
                <br/>
            </span>
            );
            amenityList.push(amenityCard);
        }
    }    

    let reviewList = 
        apartment &&
        apartment.reviews.map((review) => {
            return <Review review={review} userId={userId} accountType={accountType} key={review.id} />;
        });;
    

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
                                    <Button 
                                        style={{justifyContent: 'center'}}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {navigate(`mailto:${apartment.landlord.contactInfo}`)}}
                                        >
                                        Contact
                                    </Button>
                        </Typography>
                    </CardContent>
                    {userId === apartment.landlord.uid || accountType === 'admin' ? (
                    <DeleteApartment apartment={apartment} />):
                    null}
                </Card>
                <CardGroup>{reviewList}</CardGroup>
                {accountType === 'renter' ? (
                <Button 
                    style={{justifyContent: 'center'}}
                    variant="contained"
                    color="primary"
                    onClick={toggleAddForm}
                    >
                    Add a Review
                </Button> ):
                null}
                {isAddFormVisible ? <AddReview /> : null}
        
                <Button 
                    style={{justifyContent: 'center'}}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Previous
                </Button>

            </div>
        );
}

export default ApartmentDetails;