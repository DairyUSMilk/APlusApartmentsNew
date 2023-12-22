import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import helpers from '../utils/helpers.js';

const CreateApartmentModal = ({ isOpen, closeModal, callDatabaseFunction}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: "",
    city: "",
    state: "",
    description: "",
    price: 0,
    amenities: ""
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the database function here using the provided data
    callDatabaseFunction(formData);
    // Close the modal after calling the function
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Add Apartment Modal"
    >
      <div className="form card">
        <div className="card_header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
          </svg>
          <h1 className="form_heading">Edit Account Information</h1>
        </div>
  
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor="name">Name:</label>
            <input className="input" type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="address">Address:</label>
            <input className="input" type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="city">City:</label>
            <input className="input" type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="state">State:</label>
            <input className="input" type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="description">Description:</label>
            <input className="input" type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="price">Price:</label>
            <input className="input" type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} />
          </div>
  
          <div className='field'>
            <label htmlFor="amenities">Amenities:</label>
            <input className="input" type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleInputChange} />
          </div>
  
          <div className="buttons-container">
            <button className='button-sign' type="submit">
              <span>Submit Changes</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
  
};

export default CreateApartmentModal;
