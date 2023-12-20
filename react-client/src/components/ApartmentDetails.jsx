import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageList, ImageListItem } from '@mui/material';
import { useQuery } from "@apollo/client";

import { getApartment, getRenter, getLandlord, getAdmin } from '../graphql/Queries';
import Review from './ReviewCard';
import AddReview from './AddReview';
import DeleteApartment from './DeleteApartment';
import AddOrRemoveBookmark from './AddOrRemoveBookmark';

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

    function toggleAddForm() {
        setIsAddFormVisible(!isAddFormVisible);    
    }

    function ApartmentImages(apartment) {
        return (apartment.images ? 
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
            : null
        );
    }

    const {data, loading, error }  = useQuery(getApartment(), {
        variables: {id: id}
    });

    let query = getRenter();
    if (accountType === 'landlord') {
       query = getLandlord();
    }
    else if (accountType === 'admin') {
        query = getAdmin();
    }

    const {data: userData, loading: userLoading, error: userError }  = useQuery(query, {
      variables: {id: userId},
      skip: !accountType
    });

    if (loading) {
        return (
          <h2> Loading... </h2>
        );
    }

    if (error) {
        throw new Error(error.message);
    }

    if (userLoading) {
        return (
          <h2> Loading user data... </h2>
        );
    }
  
    if (userError) {
        throw new Error(userError);
    }

    let user;
    if (accountType === 'renter') {
      user = userData.getRenterById;
    }
    else if (accountType === 'landlord') {
      user = userData.getLandlordById;
    }
    else if (accountType === 'admin') {
      user = userData.getAdminById;
    }

    let apartment = data.getApartmentById;

    let amenityList = [];
    if(apartment.amenities) {
        let key = 0;
        for (const amenity of apartment.amenities) {
            const amenityCard = (
            <span key={key++}>
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
                    title={(apartment.name || '')}
                    sx={{
                        borderBottom: '1px solid #1e8678',
                        fontWeight: 'bold'
                    }}
                />
                <CardMedia
                   component={'div'} 
                />
                {ApartmentImages(apartment)}
                {accountType && userId !== apartment.landlord.id ? (
                    <AddOrRemoveBookmark 
                    userId={userId} 
                    apartment={apartment} 
                    inBookmark={user && user.savedApartments.some(item => item.id === apartment.id)} />): null}

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
                                    Amenities: <br />
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
                                    <br />
                                    <Button 
                                        style={{justifyContent: 'center'}}
                                        variant="outlined"
                                        color="primary"
                                        href={`mailto:${apartment.landlord.contactInfo}`}
                                        >
                                        Contact
                                    </Button>
                        </Typography>
                    </CardContent>
                    {userId === apartment.landlord.id || accountType === 'admin' ? (
                    <DeleteApartment apartment={apartment} />):
                    null}
                </Card>
                <CardGroup>{reviewList}</CardGroup>
                <br/><br/>
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
                {isAddFormVisible ? <AddReview posterId={userId} apartmentId={apartment.id} /> : null}
                <br/><br/>
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