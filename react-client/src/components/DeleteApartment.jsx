import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { deleteApartment } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function DeleteApartment ({apartment}) {
    const navigate = useNavigate();

    const [removeApartment, { loading, error }] = useMutation(deleteApartment(), {
        variables: {id: apartment.id}
    });

    function handleDelete() {
        removeApartment();
        navigate('/'); // todo - figure out refetchQuery after mutation; this is hacky
    }
    
    if (loading) { 
        return (
        <div>
            <h2>Deleting Apartment....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Deleting Apartment! {error.message}</h2>
            </div>
        );
    }
     
    return (
        <Button 
            variant="primary"
            onClick={handleDelete}
            >
            Delete
        </Button>
        );
    }
    
    export default DeleteApartment;