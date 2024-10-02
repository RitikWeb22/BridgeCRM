import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Typography,
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

const InventoryDetails = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/inventory/${id}`);
        if (response.data && typeof response.data === 'object') {
          setItem(response.data);
        } else {
          throw new Error('Received invalid data format');
        }
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        setError('Failed to fetch inventory item. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleEdit = () => {
    navigate(`/inventory/${id}/edit`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!item) {
    return <Typography>No item found.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Item Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Item ID: {item.id}</Typography>
          <Typography variant="subtitle1">Name: {item.name}</Typography>
          <Typography variant="subtitle1">SKU: {item.sku}</Typography>
          <Typography variant="subtitle1">Category: {item.category}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Current Stock: {item.quantity}
          </Typography>
          <Typography variant="subtitle1">
            Unit Price: ${item.price ? item.price.toFixed(2) : 'N/A'}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mt: 2 }}>
            Edit Item
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Attribute</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{item.description || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>{item.supplier || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reorder Point</TableCell>
              <TableCell>{item.reorderPoint || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last Restocked</TableCell>
              <TableCell>{item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryDetails;
