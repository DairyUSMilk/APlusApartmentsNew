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
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="rating">Rating:</label>
        <input
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

      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required="required"
        />
      </div>

        <button type="submit">Submit Changes</button>
      </form>
    </Modal>
  );
};

export default CreateReviewModal;
