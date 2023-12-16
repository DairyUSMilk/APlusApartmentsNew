import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { useQuery } from "@apollo/client";

import { Link, useParams, useNavigate, useRouteError } from 'react-router-dom';

import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader
} from '@mui/material';
import '../App.css';

function Apartment({apartment}) {
    const navigate = useNavigate();
    let { id } = useParams();

    function ApartmentImages() {
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
                {ApartmentImages}
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
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {navigate(`mailto:${apartment.landlord.contactInfo}`)}}
                                        >
                                        Contact
                                    </Button>
                                    {isEditFormVisible ? <apartmentUpdate object = {apartment} /> : null}

                <apartmentDelete object = {apartment}/>
                        </Typography>
                    </CardContent>
                </Card>
                <Button 
                        variant="contained"
                        color="primary"
                        onClick={toggleEditForm}
                        >
                        Edit
                        </Button>
                        {isEditFormVisible ? <apartmentUpdate object = {apartment} /> : null}

                <apartmentDelete object = {apartment}/>
                <br />
                <Button 
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

export default Apartment;