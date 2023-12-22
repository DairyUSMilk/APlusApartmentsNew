import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useLazyQuery } from '@apollo/client';
import { getApprovedApartments } from '../graphql/Queries';
import ApartmentCard from './ApartmentCard';
import helpers from './../utils/helpers.js';

import Modal from 'react-modal';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  const OpenFilterModal = () => {
    setIsFilterModalOpen(true);
  }

  const CloseFilterModal = () => {
    setIsFilterModalOpen(false);
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
        CloseFilterModal();
    }
    catch (e) {
        alert(e);
    }
  };

  const searchForm = (
    <Modal
      style={{ verticalAlign: 'middle' }}
      appElement={document.getElementById('root') || undefined}
      isOpen={isFilterModalOpen}
      onRequestClose={CloseFilterModal}
      contentLabel="Search Apartments Modal"
      >
      <div className="form card">
        <div className="card_header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
          </svg>
          <h1 className="form_heading">Search Apartments</h1>
        </div>
    
        <form onSubmit={handleSearch}>
          <div className='field'>
            <label htmlFor="apartment.city">City:</label>
            <input className="input" type="text" placeholder="City" onChange={e => setCity(e.target.value)} />
          </div>
          
          <div className='field'>
            <label htmlFor="apartment.state">State:</label>
            <input className="input" type="text" placeholder="State" onChange={e => setState(e.target.value)} />
          </div>
    
          <div className='field'>
            <label htmlFor="apartment.minPrice">Minimum Monthly Price:</label>
            <input className="input" type="number" min="0.00" step="0.01" placeholder="Min Price" onChange={e => setMinPrice(e.target.value)} />
          </div>
    
          <div className='field'>
            <label htmlFor="apartment.maxPrice">Maximum Monthly Price:</label>
            <input className="input" type="number" min="0.00" step="0.01" placeholder="Max Price" onChange={e => setMaxPrice(e.target.value)} />
          </div>
    
          <div className='field'>
            <label htmlFor="apartment.rating">Minimum Apartment Rating:</label>
            <input className="input" type="number" min="0" max="5" step="any" placeholder="Rating" onChange={e => setRating(e.target.value)} />
          </div>
  
        <div className="buttons-container">
          <button className='button-sign' variant="primary" type="submit">
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
    </Modal>
  );
  

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
      <button className='button-sign' onClick={OpenFilterModal}>
        <span>Filter</span>
      </button>
      </div>
        {searchForm}
      <div/>

      <CardGroup>{apartmentList}</CardGroup>
      
      {data && <Map apartments = {data.apartments}/>}
    </div>
  );
}

export default Home;


