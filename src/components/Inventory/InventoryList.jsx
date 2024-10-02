import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, Edit, AddCircle, Delete, Close, Search, Inventory2 } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    } else {
      // Dummy data
      const dummyData = [
        { id: 1, name: 'Product A', quantity: 100, price: 19.99, description: 'Description for Product A' },
        { id: 2, name: 'Product B', quantity: 50, price: 29.99, description: 'Description for Product B' },
        { id: 3, name: 'Product C', quantity: 75, price: 14.99, description: 'Description for Product C' },
      ];
      setInventory(dummyData);
      localStorage.setItem('inventory', JSON.stringify(dummyData));
    }
    setLoading(false);
  };

  const deleteProduct = (id) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Inventory
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/inventory/new')} 
            startIcon={<AddCircle />}
            sx={{ borderRadius: '20px', textTransform: 'none', px: 3, py: 1 }}
          >
            Add Product
          </Button>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            <Grid container spacing={3}>
              {filteredInventory.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card elevation={3} sx={{ borderRadius: '15px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" gutterBottom>{item.name}</Typography>
                          <Chip 
                            icon={<Inventory2 />} 
                            label={`Qty: ${item.quantity}`} 
                            color={item.quantity > 50 ? "success" : item.quantity > 20 ? "warning" : "error"}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">ID: {item.id}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: theme.palette.secondary.main }}>
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <IconButton onClick={() => handleOpenDialog(item)} color="primary" size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton onClick={() => navigate(`/inventory/${item.id}/edit`)} color="secondary" size="small">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => deleteProduct(item.id)} color="error" size="small">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Product Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedItem && (
            <Box>
              <Typography variant="h5" gutterBottom color="primary">{selectedItem.name}</Typography>
              <Chip 
                icon={<Inventory2 />} 
                label={`Quantity: ${selectedItem.quantity}`} 
                color={selectedItem.quantity > 50 ? "success" : selectedItem.quantity > 20 ? "warning" : "error"}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1">ID: {selectedItem.id}</Typography>
              <Typography variant="h6" sx={{ mt: 2, color: theme.palette.secondary.main }}>
                Price: ${typeof selectedItem.price === 'number' ? selectedItem.price.toFixed(2) : selectedItem.price}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Description: {selectedItem.description || 'No description available'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default InventoryList;
