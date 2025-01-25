import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Box,
  Typography,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { login, logout, checkAuthStatus } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, user]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError(null);
        await dispatch(login(values));
        handleClose();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    formik.resetForm();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRegisterClick = () => {
    handleClose();
    router.push('/register');
  };

  if (user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Hello, {user.username}!
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
        }}
      >
        Login
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Typography variant="h6" component="div">
            Login
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
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
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                position: 'relative',
              }}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleRegisterClick}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Register
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Forgot Password?
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Login;