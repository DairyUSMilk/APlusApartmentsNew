import React from 'react';
import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from '@mui/material';
import '../index.css';

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
    <div className='form card'>
      <h1>Oops!</h1>
      <br/>
      <h4>Sorry, an unexpected error has occurred.</h4>
      <p>
        <h4>Details shows below:</h4>
        <br/>
        <i>{errorMessage()}</i>
      </p>


      <div className="buttons-container">
            <Button
                className='button-error'
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  navigate(0);
                }}
            >
                <span>Home</span>
            </Button>
        <br />
        <Button
            className='button-error' 
            variant="contained"
            color="primary"
            onClick={() => {
                navigate(0);
                navigate(-1);
            }}
        >
            <span>Previous</span>
        </Button>
        </div>
    </div>
  );
}

export default Error;
