import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Divider,
  
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';


import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  orderDate: yup.date().required('Order date is required'),
  status: yup.string().required('Status is required'),
  orderItems: yup.array().of(
    yup.object().shape({
      productId: yup.string().required('Product is required'),
      quantity: yup.number().positive().integer().required('Quantity is required'),
    })
  ).min(1, 'At least one product is required'),
  totalAmount: yup.number().positive().required('Total amount is required'),
});

const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: '',
      orderDate: new Date(),
      status: 'pending',
      orderItems: [{ productId: '', quantity: 1 }],
      totalAmount: 0,
    },
  });

  const orderItems = watch('orderItems');

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  useEffect(() => {
    calculateTotalAmount();
  }, [orderItems]);

  const fetchProducts = () => {
    // Dummy product data
    const dummyProducts = [
      { id: 1, name: 'Product A', price: 10.99 },
      { id: 2, name: 'Product B', price: 15.99 },
      { id: 3, name: 'Product C', price: 20.99 },
    ];
    setProducts(dummyProducts);
  };

  const fetchOrderDetails = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = storedOrders.find(order => order.id === parseInt(id));
    if (order) {
      Object.keys(order).forEach((key) => {
        setValue(key, order[key]);
      });
    }
  };

  const handleAddOrderItem = () => {
    setValue('orderItems', [...orderItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveOrderItem = (index) => {
    setValue('orderItems', orderItems.filter((_, i) => i !== index));
  };

  const calculateTotalAmount = () => {
    const total = orderItems.reduce((sum, item) => {
      const product = products.find(p => p.id === parseInt(item.productId));
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    setValue('totalAmount', total);
  };

  const onSubmit = (data) => {
    setLoading(true);
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      ...data,
      id: id ? parseInt(id) : Date.now(),
      orderDate: data.orderDate.toISOString(),
    };

    let updatedOrders;
    if (id) {
      updatedOrders = storedOrders.map(order => order.id === parseInt(id) ? newOrder : order);
    } else {
      updatedOrders = [...storedOrders, newOrder];
    }

    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    setTimeout(() => {
      setSnackbar({ 
        open: true, 
        message: id ? 'Order updated successfully' : 'Order created successfully', 
        severity: 'success' 
      });
      navigate('/orders');
      setLoading(false);
    }, 1500);
  };

  return (
    <Box maxWidth="md" margin="auto" padding={2}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary">
          {id ? 'Edit Order' : 'Create New Order'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="orderDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Order Date"
                      renderInput={(params) => <TextField {...params} fullWidth variant="outlined" error={!!errors.orderDate} helperText={errors.orderDate?.message} />}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} variant="outlined">
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              {orderItems.map((_, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.orderItems?.[index]?.productId}>
                        <InputLabel>Product</InputLabel>
                        <Controller
                          name={`orderItems.${index}.productId`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field} variant="outlined" onChange={(e) => {
                              field.onChange(e);
                              calculateTotalAmount();
                            }}>
                              {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                  {product.name} (${product.price.toFixed(2)})
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.orderItems?.[index]?.productId && <Typography color="error" variant="caption">{errors.orderItems[index].productId.message}</Typography>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name={`orderItems.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            error={!!errors.orderItems?.[index]?.quantity}
                            helperText={errors.orderItems?.[index]?.quantity?.message}
                            onChange={(e) => {
                              field.onChange(e);
                              calculateTotalAmount();
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => handleRemoveOrderItem(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddOrderItem}
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Add Product
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.totalAmount}
                    helperText={errors.totalAmount?.message}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                {loading ? 'Processing...' : (id ? 'Update Order' : 'Create Order')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderForm;