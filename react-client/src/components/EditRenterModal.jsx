import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import helpers from '../utils/helpers.js';

const EditRenterModal = ({ isOpen, closeModal, callDatabaseFunction, userData }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    setFormData({
      name: userData.name || '',
      gender: userData.gender || '',
      dateOfBirth: helpers.reformatDateForDateInputElement(userData.dateOfBirth) || ''
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
      contentLabel="Edit Renter Info Modal"
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
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="not_specified">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Submit Changes</button>
      </form>
    </Modal>
  );
};

export default EditRenterModal;
