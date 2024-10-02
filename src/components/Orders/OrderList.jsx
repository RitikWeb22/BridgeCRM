import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress, Box, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Visibility, Edit, AddCircle, Delete, Close, ShoppingCart } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  const deleteOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const columns = [
    { id: 'id', label: 'Order ID' },
    { id: 'customerName', label: 'Customer Name' },
    { id: 'totalAmount', label: 'Total Amount', format: (value) => `$${value.toFixed(2)}` },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return theme.palette.success.main;
      case 'processing': return theme.palette.warning.main;
      case 'pending': return theme.palette.info.main;
      case 'shipped': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Order List
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            navigate('/orders/new');
            const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify(currentOrders));
          }} 
          startIcon={<AddCircle />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Create New Order
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AnimatePresence>
          <Grid container spacing={3}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card elevation={3} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <ShoppingCart />
                          </Avatar>
                          <Chip 
                            label={order.status} 
                            sx={{ 
                              backgroundColor: getStatusColor(order.status),
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                        </Box>
                        <Typography variant="h6" gutterBottom>{order.customerName}</Typography>
                        <Typography variant="body2" color="text.secondary">Order ID: {order.id}</Typography>
                        <Typography variant="body2" color="text.secondary">Total: ${order.totalAmount.toFixed(2)}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <IconButton onClick={() => handleOpenDialog(order)} color="primary" size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            onClick={() => {
                              navigate(`/orders/${order.id}/edit`);
                              localStorage.setItem('orders', JSON.stringify(orders));
                            }} 
                            color="secondary" 
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => deleteOrder(order.id)} color="error" size="small">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
                  No orders found
                </Typography>
              </Grid>
            )}
          </Grid>
        </AnimatePresence>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          Order Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Order ID: {selectedOrder.id}</Typography>
                <Typography variant="subtitle1">Customer Name: {selectedOrder.customerName}</Typography>
                <Typography variant="subtitle1">Total Amount: ${selectedOrder.totalAmount.toFixed(2)}</Typography>
                <Typography variant="subtitle1">Status: 
                  <Chip 
                    label={selectedOrder.status} 
                    sx={{ 
                      ml: 1,
                      backgroundColor: getStatusColor(selectedOrder.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</Typography>
                <Typography variant="subtitle1">Products:</Typography>
                <ul>
                  {selectedOrder.orderItems.map((item, index) => (
                    <li key={index}>{item.productId} - Quantity: {item.quantity}</li>
                  ))}
                </ul>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default OrderList;
