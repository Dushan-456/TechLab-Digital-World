import { Button, Container, Typography, Box } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Container maxWidth="md">
        <Box 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl border border-white/20 transition-transform duration-500 hover:scale-105"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 p-4 rounded-full shadow-lg shadow-fuchsia-500/30 animate-bounce">
              <RocketLaunchIcon sx={{ fontSize: 60, color: 'white' }} />
            </div>
          </div>
          
          <Typography 
            variant="h2" 
            component="h1" 
            className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 mb-4"
            sx={{ fontWeight: 800, fontFamily: 'Inter, sans-serif' }}
          >
            MERN Stack Template
          </Typography>
          
          <Typography 
            variant="h6" 
            className="text-slate-300 mb-8 font-light max-w-2xl mx-auto leading-relaxed"
          >
            A premium, high-performance boilerplate crafted with MongoDB, Express, React, and Node.js. 
            Styled flawlessly with TailwindCSS and Material UI. Start building your next big idea today.
          </Typography>
          
          <div className="flex gap-4 justify-center">
            <Button 
              component={Link}
              to="/dashboard"
              variant="contained" 
              size="large"
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-full px-8 py-3 capitalize text-lg shadow-lg shadow-fuchsia-500/25 transition-all duration-300 hover:shadow-fuchsia-500/50"
              sx={{ borderRadius: '9999px', textTransform: 'none', fontWeight: 600 }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-3 capitalize text-lg transition-all duration-300"
              sx={{ borderRadius: '9999px', textTransform: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Documentation
            </Button>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
