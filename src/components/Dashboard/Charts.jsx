import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { motion } from 'framer-motion';
import { Box, Typography, useTheme, Grid, Paper } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const Charts = () => {
  const [chartData, setChartData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Simulating API call with more detailed dummy data
    const dummyData = {
      lineChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 13000, 15000, 22000, 23000, 25000, 28000, 30000, 32000, 35000, 40000],
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Expenses',
            data: [10000, 15000, 11000, 14000, 18000, 20000, 22000, 24000, 26000, 28000, 30000, 32000],
            borderColor: theme.palette.secondary.main,
            backgroundColor: theme.palette.secondary.light,
            fill: true,
            tension: 0.4
          }
        ]
      },
      barChart: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F'],
        datasets: [
          {
            label: 'Sales',
            data: [12000, 19000, 13000, 15000, 22000, 23000],
            backgroundColor: theme.palette.success.main,
          },
          {
            label: 'Returns',
            data: [1000, 800, 1200, 600, 1500, 1000],
            backgroundColor: theme.palette.error.main,
          }
        ]
      },
      doughnutChart: {
        labels: ['Age 18-24', 'Age 25-34', 'Age 35-44', 'Age 45-54', 'Age 55+'],
        datasets: [
          {
            data: [15, 30, 25, 18, 12],
            backgroundColor: [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.success.main,
              theme.palette.warning.main,
              theme.palette.error.main,
            ],
          }
        ]
      },
      radarChart: {
        labels: ['Quality', 'Price', 'Customer Service', 'Innovation', 'Brand Image', 'Sustainability'],
        datasets: [
          {
            label: 'Company Performance',
            data: [85, 75, 90, 80, 88, 70],
            backgroundColor: theme.palette.info.light,
            borderColor: theme.palette.info.main,
            pointBackgroundColor: theme.palette.info.dark,
          }
        ]
      },
      polarAreaChart: {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        datasets: [
          {
            data: [11, 16, 7, 14, 9],
            backgroundColor: [
              theme.palette.primary.light,
              theme.palette.secondary.light,
              theme.palette.success.light,
              theme.palette.warning.light,
              theme.palette.error.light,
            ],
          }
        ]
      }
    };

    setTimeout(() => setChartData(dummyData), 1000); // Simulate loading delay
  }, [theme.palette]);

  if (!chartData) {
    return <Typography variant="h6">Loading charts...</Typography>;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Chart Title', font: { size: 18 } }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: theme.palette.divider
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Monthly Revenue vs Expenses</Typography>
              <Line data={chartData.lineChart} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Product Sales and Returns</Typography>
              <Bar data={chartData.barChart} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Customer Demographics</Typography>
              <Doughnut data={chartData.doughnutChart} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Company Performance</Typography>
              <Radar data={chartData.radarChart} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Regional Distribution</Typography>
              <PolarArea data={chartData.polarAreaChart} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;
