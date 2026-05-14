import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, MenuItem, Button, Box, Alert, Paper } from '@mui/material';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    cardId: '',
    templateId: 'ethereal',
    bride: '',
    groom: '',
    date: '',
    location: '',
    welcomeText: '',
  });

  const [status, setStatus] = useState({ type: '', message: '', url: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', url: '' });

    const payload = {
      cardId: formData.cardId,
      templateId: formData.templateId,
      couple: {
        bride: formData.bride,
        groom: formData.groom,
      },
      event: {
        date: formData.date,
        location: formData.location,
      },
      content: {
        welcomeText: formData.welcomeText,
      },
    };

    try {
      // Note: adjust the URL if your API is not running on same origin or use a proxy
      const response = await axios.post('/api/v1/invitations', payload, {
        withCredentials: true,
      });

      setStatus({
        type: 'success',
        message: 'Invitation created successfully!',
        url: `${window.location.origin}/v/${formData.cardId}`,
      });
      
      // Optional: reset form
      // setFormData({ cardId: '', templateId: 'ethereal', bride: '', groom: '', date: '', location: '', welcomeText: '' });
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error creating invitation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 font-sans text-slate-800">
      <Container maxWidth="md">
        <Box className="mb-12 text-center">
          <Typography variant="h3" component="h1" className="font-semibold tracking-tight text-slate-900 mb-4" sx={{ fontFamily: 'Inter, sans-serif' }}>
            Create Invitation
          </Typography>
          <Typography variant="subtitle1" className="text-slate-500 max-w-xl mx-auto">
            Design and generate a beautiful digital invitation for your upcoming event. Fill out the details below.
          </Typography>
        </Box>

        <Paper elevation={0} className="p-8 md:p-12 rounded-3xl border border-slate-200 bg-white shadow-sm">
          {status.message && (
            <Alert 
              severity={status.type} 
              className="mb-8 rounded-xl"
              action={
                status.url && (
                  <Button color="inherit" size="small" href={status.url} target="_blank">
                    View Card
                  </Button>
                )
              }
            >
              {status.message}
              {status.url && (
                <div className="mt-2 font-medium break-all">
                  <a href={status.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-blue-600 transition-colors">
                    {status.url}
                  </a>
                </div>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TextField
                label="Card ID (Slug)"
                name="cardId"
                value={formData.cardId}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                helperText="Must be unique (e.g., john-jane-2026)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                select
                label="Template Selection"
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value="ethereal">Ethereal (Minimalist & Earthy)</MenuItem>
                <MenuItem value="lumina">Lumina (Modern Glassmorphism)</MenuItem>
                <MenuItem value="kinetic">Kinetic (Dynamic & Fluid)</MenuItem>
              </TextField>

              <TextField
                label="Bride Name"
                name="bride"
                value={formData.bride}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Groom Name"
                name="groom"
                value={formData.groom}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Event Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Event Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </div>

            <TextField
              label="Welcome Text"
              name="welcomeText"
              value={formData.welcomeText}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="We invite you to celebrate our special day..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Box className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-3.5 text-base shadow-md transition-transform active:scale-95 capitalize"
                sx={{ borderRadius: '9999px', textTransform: 'none', fontWeight: 500 }}
              >
                {loading ? 'Generating...' : 'Generate Invitation'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
