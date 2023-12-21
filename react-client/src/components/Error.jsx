import React from 'react';
import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from '@mui/material';

 function Error() {
  const error = useRouteError();
  const navigate = useNavigate();

  const errorMessage = () => {
    let message = '';
    if (error.status) {
      message += error.status + ': ';
    }
    return message + (error.statusText || error.message);
  };

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage()}</i>
      </p>
            <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  navigate(0);
                }}
            >
                Home
            </Button>
        <br /><br />
        <Button 
            variant="contained"
            color="primary"
            onClick={() => {
                navigate(0);
                navigate(-1);
            }}
        >
            Previous
        </Button>
    </div>
  );
}

export default Error;