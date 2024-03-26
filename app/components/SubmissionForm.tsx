import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { submitSubmission } from '../redux/slices/submissionSlice'; // Import submitOrUpdateSubmission from submissionSlice

const SubmissionForm: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [formData, setFormData] = useState({ title: '', url: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if title is empty
    if (!formData.title) {
      setErrorMessage('Title is required');
      return;
    }

    // Validate the URL structure and include 'soundcloud.com'
    const urlRegex = /^https?:\/\/(soundcloud\.com\/\S+)$/i;
    if (!urlRegex.test(formData.url)) {
      // Handle invalid URL, show error message, etc.
      setErrorMessage('Invalid Soundcloud URL');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(submitSubmission(formData)); // Dispatch submitOrUpdateSubmission action
      setSubmissionSuccess(true);
    } catch (error) {
      console.error('Error submitting or updating submission:', error);
      setErrorMessage('Error submitting or updating submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!submissionSuccess ? (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{ backgroundColor: 'black', color: 'white' }}
            />
          </label>
          <br />
          <label>
            Soundcloud URL:
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              style={{ backgroundColor: 'black', color: 'white' }}
            />
          </label>
          <br />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      ) : (
        <div>
          <p>Submission successful!</p>
          {/* Optionally add more content or actions after successful submission */}
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;
