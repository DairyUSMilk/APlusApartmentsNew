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
      <h2>Edit Account Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="contactEmail">Contact Email:</label>
          <input
            type="text"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactInfo}
            onChange={handleInputChange}
          />
        </div>

        <br/>
        <button className='button-sign' type="submit">
          <span>Submit Changes</span>
        </button>


      </form>
    </Modal>
  );
};

export default EditLandlordModal;
