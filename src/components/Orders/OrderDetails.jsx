import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/orders/${id}/edit`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!order) {
    return <Typography variant="h6">Order not found</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Order ID: {order.id}</Typography>
          <Typography variant="subtitle1">
            Customer: {order.customer.name}
          </Typography>
          <Typography variant="subtitle1">
            Order Date: {format(new Date(order.orderDate), 'PPP')}
          </Typography>
          <Typography variant="subtitle1">Status: {order.status}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Total Amount: ${order.totalAmount.toFixed(2)}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Edit Order
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ${item.product.price.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderDetails;
