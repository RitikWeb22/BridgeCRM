import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, IconButton, Tooltip, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Refresh as RefreshIcon, Warning as WarningIcon, TrendingUp as TrendingUpIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
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

const Reporting = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  useEffect(() => {
    fetchReportingData();
  }, []);

  const fetchReportingData = async () => {
    setLoading(true);
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedSalesData = localStorage.getItem('salesData');
      const storedInventoryAlerts = localStorage.getItem('inventoryAlerts');

      if (storedSalesData && storedInventoryAlerts) {
        setSalesData(JSON.parse(storedSalesData));
        setInventoryAlerts(JSON.parse(storedInventoryAlerts));
      } else {
        const dummySalesData = [
          { date: '2023-05-01', amount: 1000 },
          { date: '2023-05-02', amount: 1200 },
          { date: '2023-05-03', amount: 800 },
          { date: '2023-05-04', amount: 1500 },
          { date: '2023-05-05', amount: 2000 },
        ];
        const dummyInventoryAlerts = [
          { id: 1, name: 'Product A', quantity: 5, reorderPoint: 10 },
          { id: 2, name: 'Product B', quantity: 2, reorderPoint: 15 },
          { id: 3, name: 'Product C', quantity: 8, reorderPoint: 20 },
        ];

        setSalesData(dummySalesData);
        setInventoryAlerts(dummyInventoryAlerts);

        localStorage.setItem('salesData', JSON.stringify(dummySalesData));
        localStorage.setItem('inventoryAlerts', JSON.stringify(dummyInventoryAlerts));
      }
    } catch (err) {
      setError('Failed to fetch reporting data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Report',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Amount',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
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
              Reporting and Notifications
            </Typography>
            <Tooltip title="Refresh Data">
              <StyledIconButton onClick={fetchReportingData}>
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
        <Grid item xs={12} md={8}>
          <AnimatePresence>
            <motion.div
              key="sales-chart"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                    Sales Report
                  </Typography>
                  {salesData.length > 0 ? (
                    <Box sx={{ height: 400 }}>
                      <Bar data={chartData} options={chartOptions} />
                    </Box>
                  ) : (
                    <Typography>No sales data available</Typography>
                  )}
                </CardContent>
              </StyledCard>
            </motion.div>
          </AnimatePresence>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatePresence>
            <motion.div
              key="inventory-alerts"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                    Inventory Alerts
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Reorder Point</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <AnimatePresence>
                          {inventoryAlerts.length > 0 ? (
                            inventoryAlerts.map((item) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <TableCell component="th" scope="row">
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                    >
                                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                                    </motion.div>
                                    {item.name}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{item.reorderPoint}</TableCell>
                              </motion.tr>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">No inventory alerts</TableCell>
                            </TableRow>
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </StyledCard>
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reporting;
