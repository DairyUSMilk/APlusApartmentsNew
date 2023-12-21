import React from 'react';
import { useMutation } from "@apollo/client";
import { getPendingApartments } from '../graphql/Queries';
import { approveApartment } from '../graphql/Mutations';

import Button from 'react-bootstrap/Button';
import '../index.css';

function ApproveApartment ({apartment}) {
    const [acceptApartment, { loading, error }] = useMutation(approveApartment(), {
        variables: {id: apartment.id},
        refetchQueries: [
            { query: getPendingApartments() }
        ]
    });

    function handleApprove() {
        acceptApartment();
    }
    
    if (loading) { 
        return (
        <div>
            <h2>Approving Apartment....</h2>
        </div>);
        }
    
    if (error) {
        return (
            <div>
                <h2>Error Approving Apartment! {error.message}</h2>
            </div>
        );
    }
     
    return (
        <div className="buttons-container">

        <Button className='button-sign'
            variant="primary"
            onClick={handleApprove}
            >
            <span>Approve</span>
        </Button>
        </div>
        );
    }
    
    export default ApproveApartment;
