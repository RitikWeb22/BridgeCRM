import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, Button, TextField, List, ListItem, ListItemText, Box, Card, CardContent, IconButton, Tooltip, Snackbar } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, VpnKey as VpnKeyIcon, Check as CheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease-in-out',
  borderRadius: '50%',
  padding: theme.spacing(1),
}));

const Integration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchIntegrations();
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyIntegrations = [
        { id: 1, name: 'Shopify', description: 'E-commerce platform integration' },
        { id: 2, name: 'Stripe', description: 'Payment processing integration' },
        { id: 3, name: 'Mailchimp', description: 'Email marketing integration' },
      ];
      setIntegrations(dummyIntegrations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching integrations:', err);
      setError('Failed to fetch integrations. Please try again later.');
      setLoading(false);
    }
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSaveApiKey = async () => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('apiKey', apiKey);
      setLoading(false);
      setSnackbarMessage('API key saved successfully');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error saving API key:', err);
      setError('Failed to save API key. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Integration & API
            </Typography>
            <Tooltip title="Refresh Integrations">
              <StyledIconButton onClick={fetchIntegrations}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: 0 }}
                >
                  <RefreshIcon />
                </motion.div>
              </StyledIconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <AnimatePresence>
            <motion.div
              key="api-key-management"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <VpnKeyIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                    API Key Management
                  </Typography>
                  <TextField
                    fullWidth
                    label="API Key"
                    variant="outlined"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveApiKey}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: '20px' }}
                  >
                    Save API Key
                  </Button>
                </CardContent>
              </StyledCard>
            </motion.div>
          </AnimatePresence>
        </Grid>
        <Grid item xs={12} md={6}>
          <AnimatePresence>
            <motion.div
              key="available-integrations"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <AddIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                    Available Integrations
                  </Typography>
                  <List>
                    {integrations.length > 0 ? (
                      integrations.map((integration) => (
                        <ListItem key={integration.id}>
                          <ListItemText
                            primary={integration.name}
                            secondary={integration.description}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<CheckIcon />}
                            sx={{ borderRadius: '20px' }}
                          >
                            Connect
                          </Button>
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No integrations available" />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </StyledCard>
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Integration;
