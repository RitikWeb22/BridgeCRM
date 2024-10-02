import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, Grid, Button, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = () => {
    setLoading(true);
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const foundInvoice = invoices.find(inv => inv.id === parseInt(id));
    if (foundInvoice) {
      setInvoice(foundInvoice);
    } else {
      alert('Invoice not found');
      navigate('/invoices');
    }
    setLoading(false);
  };

  const handleEdit = () => {
    navigate(`/invoices/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const updatedInvoices = invoices.filter(inv => inv.id !== parseInt(id));
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      navigate('/invoices');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!invoice) {
    return <Typography>Invoice not found</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Invoice Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Invoice Number: {invoice.id}</Typography>
            <Typography variant="subtitle1">Date: {invoice.date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Customer: {invoice.customer}</Typography>
            <Typography variant="subtitle1">Total: ${invoice.total.toFixed(2)}</Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Items</Typography>
        {invoice.items.map((item, index) => (
          <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography>{item.description}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Qty: {item.quantity}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Price: ${item.unitPrice.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Total: ${(item.quantity * item.unitPrice).toFixed(2)}</Typography>
            </Grid>
          </Grid>
        ))}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit Invoice
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete Invoice
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default InvoiceDetail;
