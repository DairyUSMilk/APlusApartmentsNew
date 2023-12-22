import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useMutation } from "@apollo/client";
import { addApartmentToBookmark, removeApartmentFromBookmark } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function AddOrRemoveBookmark ({apartment, inBookmark}) {
    const { userData } = useContext(UserContext);

    const [isInBookmark, setInBookmark] = useState(inBookmark);

    const [addBookmark] = useMutation(addApartmentToBookmark(), {
        variables: {userId: userData.id, apartmentId: apartment.id}
    });

    const [removeBookmark] = useMutation(removeApartmentFromBookmark(), {
        variables: {userId: userData.id, apartmentId: apartment.id}
    });

    function handleAddBookmark() {
        addBookmark();
        setInBookmark(true);
    }

    function handleRemoveBookmark() {
        removeBookmark();
        setInBookmark(false);
    }
    //
    return (
        userData.id !== apartment.landlord.id ? (
            <div className="buttons-container">
                {isInBookmark ? (
                    <Button 
                        className='button-sign'
                        variant="primary"
                        onClick={handleRemoveBookmark}
                    >
                        <span>Unsave</span>
                    </Button>
                ) : (
                    <Button 
                        className='button-sign'
                        variant="primary"
                        onClick={handleAddBookmark}
                    >
                        <span>Save</span>
                    </Button>
                )}
            </div>
        ) : null
    );
    
    }
    
    export default AddOrRemoveBookmark;
