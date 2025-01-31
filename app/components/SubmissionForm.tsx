import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { submitSubmission, updateFormField } from '../redux/slices/submissionSlice';
import { openLoginModal } from '../redux/slices/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  url: Yup.string()
    .required('URL is required')
    .matches(
      /^https?:\/\/(soundcloud\.com|on\.soundcloud\.com)\/(.+)$/,
      'Must be a valid SoundCloud URL'
    ),
});

const SubmissionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => {
    console.log('Auth State:', {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user,
      token: state.auth.token
    });
    return state.auth.isAuthenticated;
  });
  const { form, loading, error } = useSelector((state: RootState) => state.submission);

  const formik = useFormik({
    initialValues: form,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Check auth state first
        console.log('isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
          dispatch(openLoginModal());
          return;
        }

        // Only try to submit if authenticated
        await dispatch(submitSubmission(values)).unwrap();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name as 'title' | 'url', value }));
    formik.handleChange(e);
  };

  // Updated form validation logic
  const isFormValid = 
    formik.values.title.trim() !== '' && 
    formik.values.url.trim() !== '' && 
    Object.keys(formik.errors).length === 0;

  console.log('Form State:', {
    values: formik.values,
    errors: formik.errors,
    isAuthenticated,
    isFormValid,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <TextField
          fullWidth
          id="title"
          name="title"
          label="Song Title"
          value={formik.values.title}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          disabled={formik.isSubmitting || loading}
        />

        <TextField
          fullWidth
          id="url"
          name="url"
          label="SoundCloud URL"
          value={formik.values.url}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.url && Boolean(formik.errors.url)}
          helperText={formik.touched.url && formik.errors.url}
          disabled={formik.isSubmitting || loading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || formik.isSubmitting || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {loading ? 'Submitting...' : 'Submit Song'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default SubmissionForm;
