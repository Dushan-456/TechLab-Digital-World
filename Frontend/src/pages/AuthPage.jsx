import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    emailOrUsername: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await API.post('/users/login', {
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
        });
        login(data.user);
        navigate('/dashboard');
      } else {
        const { data } = await API.post('/users/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        login(data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="sm">
        <Paper elevation={0} className="p-8 md:p-12 rounded-3xl border border-slate-200 bg-white shadow-xl">
          <Box className="text-center mb-8">
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </Typography>
            <Typography variant="body1" className="text-slate-500">
              {isLogin ? 'Sign in to access your dashboard.' : 'Sign up to start creating beautiful invitations.'}
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-6 rounded-xl">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>
            )}

            {!isLogin && (
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}

            {!isLogin && (
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}

            {isLogin && (
              <TextField
                label="Username or Email"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full py-3.5 text-base shadow-md capitalize"
              sx={{ borderRadius: '9999px', textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <Box className="mt-8 text-center">
            <Typography variant="body2" className="text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-semibold text-slate-800 hover:text-blue-600 underline underline-offset-4 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default AuthPage;
