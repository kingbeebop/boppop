import React, { useState } from 'react';

interface SubmissionFormProps {
  submitOrUpdateSubmission: (newData: any) => Promise<void>; // Update with actual type
  initialData: { title: string; soundcloudUrl: string };
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ submitOrUpdateSubmission, initialData }) => {
  const [title, setTitle] = useState<string>(initialData.title);
  const [soundcloudUrl, setSoundcloudUrl] = useState<string>(initialData.soundcloudUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the URL structure and include 'soundcloud.com'
    const urlRegex = /^https?:\/\/(soundcloud\.com\/\S+)$/i;
    if (!urlRegex.test(soundcloudUrl)) {
      // Handle invalid URL, show error message, etc.
      console.error('Invalid Soundcloud URL');
      return;
    }

    try {
      await submitOrUpdateSubmission({ title, soundcloudUrl });
      // Optionally reset form fields or perform other actions after submission
      // setTitle('');
      // setSoundcloudUrl('');
    } catch (error) {
      console.error('Error submitting or updating submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Soundcloud URL:
        <input type="text" value={soundcloudUrl} onChange={(e) => setSoundcloudUrl(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubmissionForm;
