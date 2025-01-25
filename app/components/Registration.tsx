import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../services/api';

// Validation schema
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password1: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1')], 'Passwords must match')
    .required('Please confirm your password'),
});

const Registration: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password1: '',
      password2: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        await registerUser(
          {username: values.username,
          password: values.password1,
          password2: values.password2,
          email: values.email}
        );
        setRegistrationSuccess(true);
        setTimeout(() => {
          router.push('/'); // Redirect to home page after successful registration
        }, 2000);
      } catch (error: any) {
        setServerError(
          error.response?.data?.message || 'An error occurred during registration'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>

          {registrationSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting...
            </Alert>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                {serverError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {serverError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                  fullWidth
                  id="password1"
                  name="password1"
                  label="Password"
                  type="password"
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password1 && Boolean(formik.errors.password1)}
                  helperText={formik.touched.password1 && formik.errors.password1}
                />

                <TextField
                  fullWidth
                  id="password2"
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password2 && Boolean(formik.errors.password2)}
                  helperText={formik.touched.password2 && formik.errors.password2}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Register'
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => router.push('/login')}
                  sx={{ mt: 1 }}
                >
                  Already have an account? Login
                </Button>
              </Stack>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Registration;