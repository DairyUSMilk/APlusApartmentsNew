import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useLazyQuery } from '@apollo/client';
import { getApprovedApartments } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';
//import SearchApartmentsByFilter from './ApartmentsByFilter';
import helpers from './../utils/helpers.js';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CardGroup from 'react-bootstrap/CardGroup';
import '../index.css';

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
          <Form.Label>Minimum Montly Price:</Form.Label>
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
        <Button variant="primary" type="submit">
          Search
        </Button>
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
    <div className='card'>
      <h2>Apartments for Rent</h2>
      <h4>Search by:</h4>
      
      <Button 
        style={{justifyContent: 'center'}}
        variant="contained"
        color="primary"
        onClick={toggleSearchForm}
        >
        Filter Apartments
      </Button> 
      
      {isSearchFormVisible ? searchForm : null}

      <CardGroup>{apartmentList}</CardGroup>
    </div>
  );
}

export default Home;
