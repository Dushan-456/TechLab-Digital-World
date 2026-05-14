import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

import EtherealTemplate from '../components/templates/EtherealTemplate';
import LuminaTemplate from '../components/templates/LuminaTemplate';
import KineticTemplate from '../components/templates/KineticTemplate';

const CardViewer = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`/api/v1/invitations/${cardId}`);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Invitation not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardData();
    }
  }, [cardId]);

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-slate-50">
        <CircularProgress size={60} thickness={2} sx={{ color: '#0f172a' }} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <Typography variant="h3" className="text-slate-800 mb-4 font-bold tracking-tight">
          Oops!
        </Typography>
        <Typography variant="h6" className="text-slate-500 mb-8 font-light">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ borderRadius: '9999px', px: 4, py: 1.5, borderColor: '#cbd5e1', color: '#334155' }}
        >
          Go Home
        </Button>
      </Box>
    );
  }

  // Render the appropriate template
  switch (data.templateId) {
    case 'ethereal':
      return <EtherealTemplate data={data} />;
    case 'lumina':
      return <LuminaTemplate data={data} />;
    case 'kinetic':
      return <KineticTemplate data={data} />;
    default:
      return <EtherealTemplate data={data} />; // Fallback
  }
};

export default CardViewer;
