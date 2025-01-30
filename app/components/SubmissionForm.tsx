import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { submitSubmission } from '../redux/slices/submissionSlice';
import { openLoginModal } from '../redux/slices/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Fade,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  url: Yup.string()
    .required('SoundCloud URL is required')
    .url('Must be a valid URL')
    .matches(
      /^https?:\/\/(soundcloud\.com|snd\.sc)\/.+$/,
      'Must be a valid SoundCloud URL'
    ),
});

const SubmissionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!isAuthenticated) {
        dispatch(openLoginModal());
        setSubmitting(false);
        return;
      }

      try {
        await dispatch(submitSubmission(values)).unwrap();
        setSubmissionSuccess(true);
        resetForm();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (submissionSuccess) {
    return (
      <Fade in>
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Song submitted successfully!
          </Alert>
          <Button
            variant="outlined"
            onClick={() => setSubmissionSuccess(false)}
            fullWidth
          >
            Submit Another Song
          </Button>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Submit Your Song
            </Typography>

            <TextField
              fullWidth
              id="title"
              name="title"
              label="Song Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              fullWidth
              id="url"
              name="url"
              label="SoundCloud URL"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && Boolean(formik.errors.url)}
              helperText={
                (formik.touched.url && formik.errors.url) ||
                'Paste your SoundCloud track URL here'
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={formik.isSubmitting}
              startIcon={
                formik.isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CloudUploadIcon />
                )
              }
            >
              {formik.isSubmitting ? 'Submitting...' : 'Submit Song'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Fade>
  );
};

export default SubmissionForm;
