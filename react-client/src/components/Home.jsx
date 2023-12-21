import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useLazyQuery } from '@apollo/client';
import { getApprovedApartments } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';
import helpers from './../utils/helpers.js';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CardGroup from 'react-bootstrap/CardGroup';
import '../index.css';
import Map from './Map';

function Home() {
  const { userData } = useContext(UserContext);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [rating, setRating] = useState(0);
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);

  const [ getApartments, { data, loading, error }] = useLazyQuery(getApprovedApartments());
  
  useEffect(() => {
    getApartments();
  }, []);

  if (loading) {
    return (
      <h2> Loading apartments... </h2>
    );
  }
    if (error) {
      throw new Error(error.message);
  }

  function toggleSearchForm() {
    setIsSearchFormVisible(!isSearchFormVisible);    
  }

  const handleSearch = (event) => {
    event.preventDefault();
    let newSearch = {
    };
    if (city) newSearch.city=helpers.checkString(city, 'city');
    if (state) newSearch.state=helpers.checkState(state, 'state');
    if (minPrice) newSearch.minPrice=helpers.checkNumber(Number(minPrice), 'price');
    if (maxPrice) {
      newSearch.maxPrice=helpers.checkNumber(Number(maxPrice), 'price');
      if (minPrice && maxPrice <= minPrice) throw 'Max price must be higher than min price'
    }
    if (rating) newSearch.rating=helpers.checkNumber(Number(rating), 'price');
    try {
        getApartments({ variables: newSearch });  
        setCity('');
        setState('');
        setMinPrice(0);
        setMaxPrice(0);
        setRating(0);
    }
    catch (e) {
        alert(e);
    }
  };

  const searchForm = (
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3" controlId="apartment.city">
          <Form.Label>City:</Form.Label>
          <Form.Control type="text" placeholder="City" onChange={e => setCity(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.state">
          <Form.Label>State:</Form.Label>
          <Form.Control type="text" placeholder="State" onChange={e => setState(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.minPrice">
          <Form.Label>Minimum Monthly Price:</Form.Label>
          <Form.Control type="number" min="0.00" step="0.01" placeholder="Min Price" onChange={e => setMinPrice(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.maxPrice">
          <Form.Label>Maximum Monthly Price:</Form.Label>
          <Form.Control type="number" min="0.00" step="0.01" placeholder="Max Price" onChange={e => setMaxPrice(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment.rating">
          <Form.Label>Minumum Apartment Rating:</Form.Label>
          <Form.Control type="number" min="0" max="5" placeholder="Rating" onChange={e => setRating(e.target.value)} />
        </Form.Group>

        <div className="buttons-container">

        <Button className='button-sign' style={{ verticalAlign: 'middle' }} variant="primary" type="submit">
          <span>Search</span>
        </Button>

        </div>
      </Form>
    );


  console.log(data);

  let apartmentList =  
    data &&
    data.apartments.map((apartment) => {
        return (
        <ApartmentCard 
          apartment={apartment} 
          inBookmark={userData && userData.savedApartments.some(item => item.id === apartment.id)}
          key={apartment.id} 
        />
        );
    });

  return (
    <div>
      <div className='card-home_header'>
      <h1>Apartment Finder</h1>
      <h4>Welcome to Apartment Finder, your perfect solution for apartment hunting. Our web application is designed to simplify the process of finding the perfect apartment with a user-friendly interface for both landlords and renters.</h4>
      <h4>At Apartment Finder, we understand the difficulties  of search for a new home. Our platform serves two user groups: Landlords and Renters. Landlords can submit applications for their properties, which are then reviewed by our admin team. This process includes a detailed verification step to ensure that all listings on our site meet our high standards for safety. And for renters, they can submit reviews on apartments.</h4>
      <h2>Apartments for Rent</h2>
      <h4>Search by:</h4>
      </div>

      <div className="buttons-container">

      <Button 
        className='button-sign' 
        style={{ verticalAlign: 'middle' }}
        variant="contained"
        color="primary"
        onClick={toggleSearchForm}
        >
        <span>Filter Apartments</span>
      </Button> 

      </div>
      
      {isSearchFormVisible ? searchForm : null}

      <CardGroup>{apartmentList}</CardGroup>
      
      {data && <Map apartments = {data.apartments}/>}
    </div>
  );
}

export default Home;


