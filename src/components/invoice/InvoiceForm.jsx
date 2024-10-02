import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    date: '',
    customer: '',
    items: [{ name: '', quantity: 1, unitPrice: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = () => {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.id === parseInt(id));
    if (invoice) {
      setFormData(invoice);
    } else {
      alert('Invoice not found');
      navigate('/invoices');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      items: prevState.items.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prevState => ({
      ...prevState,
      items: [...(prevState.items || []), { name: '', quantity: 1, unitPrice: '' }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prevState => ({
      ...prevState,
      items: prevState.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return (formData.items || []).reduce((total, item) => {
      return total + (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const newInvoice = {
      ...formData,
      id: id ? parseInt(id) : Date.now(),
      total: calculateTotal(),
    };

    if (id) {
      const index = invoices.findIndex(inv => inv.id === parseInt(id));
      if (index !== -1) {
        invoices[index] = newInvoice;
      }
    } else {
      invoices.push(newInvoice);
    }

    localStorage.setItem('invoices', JSON.stringify(invoices));
    setLoading(false);
    navigate('/invoices');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Invoice' : 'Create New Invoice'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Invoice ID"
                name="id"
                value={formData.id || ''}
                onChange={handleChange}
                disabled={!!id}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer"
                name="customer"
                value={formData.customer || ''}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={expandedItems ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              onClick={() => setExpandedItems(!expandedItems)}
            >
              {expandedItems ? 'Hide' : 'Show'} Invoice Items
            </Button>
          </Box>

          <Collapse in={expandedItems}>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(formData.items || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          name="name"
                          value={item.name || ''}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          name="quantity"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          name="unitPrice"
                          value={item.unitPrice || ''}
                          onChange={(e) => handleItemChange(index, e)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          required
                        />
                      </TableCell>
                      <TableCell align="right">
                        ${((parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(index)}
                          disabled={(formData.items || []).length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Item
            </Button>
          </Collapse>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Total: ${calculateTotal().toFixed(2)}
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (id ? 'Update Invoice' : 'Create Invoice')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default InvoiceForm;
