import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, CircularProgress, Paper, Grid, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    quantity: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = () => {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const product = inventory.find(item => item.id === parseInt(id));
    if (product) {
      setFormData({
        ...product,
        price: parseFloat(product.price).toFixed(2)
      });
    } else {
      alert('Product not found');
      navigate('/inventory');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'price' ? parseFloat(value).toFixed(2) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };
    
    if (id) {
      const updatedInventory = inventory.map(item => 
        item.id === parseInt(id) ? { ...productData, id: parseInt(id) } : item
      );
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      alert('Product updated successfully');
    } else {
      const newId = Math.max(...inventory.map(item => item.id), 0) + 1;
      const newProduct = { ...productData, id: newId };
      localStorage.setItem('inventory', JSON.stringify([...inventory, newProduct]));
      alert('Product created successfully');
    }
    
    setLoading(false);
    navigate('/inventory');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '15px' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          {id ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  borderRadius: '10px',
                  textTransform: 'none'
                }}
              >
                {loading ? <CircularProgress size={24} /> : (id ? 'Update Product' : 'Create Product')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default InventoryForm;
