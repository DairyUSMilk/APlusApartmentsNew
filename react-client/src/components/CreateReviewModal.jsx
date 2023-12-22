import React, { useState } from 'react';
import Modal from 'react-modal';

const CreateReviewModal = ({ isOpen, closeModal, callDatabaseFunction}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    content: ""
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
      appElement={document.getElementById('root') || undefined}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Add Review Modal"
    >
      <div className="form card">
        <div className="card_header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
          </svg>
          <h1 className="form_heading">Add Review</h1>
        </div>
  
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor="rating">Rating:</label>
            <input
              className="input"
              type="number"
              id="rating"
              name="rating"
              min="0"
              max="5"
              step="1"
              value={formData.rating}
              onChange={handleInputChange}
              required="required"
            />
          </div>
  
          <div className='field'>
            <label htmlFor="content">Content:</label>
            <textarea
              className="input"
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required="required"
            />
          </div>
  
          <div className="buttons-container">
            <button className='button-sign' type="submit">
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
  
};

export default CreateReviewModal;
