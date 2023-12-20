import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { addApartmentToBookmark, removeApartmentFromBookmark } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function AddOrRemoveBookmark ({userId, apartment, inBookmark}) {
    const [isInBookmark, setInBookmark] = useState(inBookmark);

    const [addBookmark] = useMutation(addApartmentToBookmark(), {
        variables: {userId: userId, apartmentId: apartment.id}
    });

    const [removeBookmark] = useMutation(removeApartmentFromBookmark(), {
        variables: {userId: userId, apartmentId: apartment.id}
    });

    function handleAddBookmark() {
        addBookmark();
        setInBookmark(true);
    }

    function handleRemoveBookmark() {
        removeBookmark();
        setInBookmark(false);
    }
     
    return (
        userId !== apartment.landlord.id ? (
            isInBookmark ? 
            <Button 
                className='addBookmark'
                variant="primary"
                onClick={handleRemoveBookmark}
                >
                Unsave
            </Button> :
            <Button 
                className='removeBookmark'
                variant="primary"
                onClick={handleAddBookmark}
                >
                Save
            </Button> 
        ) : null
    );
    }
    
    export default AddOrRemoveBookmark;