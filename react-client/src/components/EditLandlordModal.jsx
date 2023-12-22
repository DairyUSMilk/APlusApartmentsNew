import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import helpers from '../utils/helpers.js';

const EditLandlordModal = ({ isOpen, closeModal, callDatabaseFunction, userData }) => {
    const [formData, setFormData] = useState({
    name: '',
    contactInfo: ""
  });

  useEffect(() => {
    setFormData({
      name: userData.name || '',
      contactInfo: userData.contactInfo || ''
    });
  }, [isOpen, userData]);

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
      contentLabel="Edit Landlord Info Modal"
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
            <input
              className="input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
  
          <div className='field'>
            <label htmlFor="contactEmail">Contact Email:</label>
            <input
              className="input"
              type="text"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactInfo}
              onChange={handleInputChange}
            />
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

export default EditLandlordModal;
