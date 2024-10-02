import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Grid, Paper, Box, IconButton, List, ListItem, ListItemText, Button, Tooltip, CircularProgress, Avatar, Menu, MenuItem, Badge } from '@mui/material';
import { BarChart, Timeline, Speed, Notifications, Settings, AddShoppingCart, Receipt, Inventory, ShoppingCart, Payment, LocalShipping, Inventory2, PersonAdd } from '@mui/icons-material';
import Charts from '../components/Dashboard/Charts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import * as THREE from 'three';

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const theme = useTheme();
  const threeJsRef = useRef(null);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1500);

    // Three.js setup
    if (threeJsRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      threeJsRef.current.appendChild(renderer.domElement);

      // Create a modern, abstract 3D object
      const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      const material = new THREE.MeshPhongMaterial({ color: theme.palette.primary.main, shininess: 100 });
      const torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);

      // Add lighting
      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, 10);
      scene.add(light);

      camera.position.z = 30;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
        scene.remove(torusKnot);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (threeJsRef.current) {
          threeJsRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [theme.palette.primary.main]);

  const handleNotificationClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotifications(null);
    setNotificationCount(0);
  };

  const handleSettingsClick = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorElSettings(null);
  };

  const recentActivity = [
    { id: 1, action: 'New order received', details: 'Order #12345 from Hospital A', time: '2 minutes ago', icon: <ShoppingCart /> },
    { id: 2, action: 'Invoice paid', details: 'Invoice #1234 by Client XYZ', time: '1 hour ago', icon: <Payment /> },
    { id: 3, action: 'Shipment delivered', details: 'Shipment #5678 to Clinic B', time: '3 hours ago', icon: <LocalShipping /> },
  ];

  const statistics = [
    { label: 'Total Orders', value: 1234, change: '+5%' },
    { label: 'Revenue', value: '$45,678', change: '+12%' },
    { label: 'Pending Shipments', value: 56, change: '-3%' },
    { label: 'Active Clients', value: 89, change: '+8%' },
  ];

  const quickActions = [
    { 
      label: 'Create Order', 
      icon: <AddShoppingCart />, 
      action: () => console.log('Create Order clicked'),
      color: theme.palette.success.main
    },
    { 
      label: 'Generate Invoice', 
      icon: <Receipt />, 
      action: () => console.log('Generate Invoice clicked'),
      color: theme.palette.primary.main
    },
    { 
      label: 'View Inventory', 
      icon: <Inventory />, 
      action: () => console.log('View Inventory clicked'),
      color: theme.palette.warning.main
    },
  ];

  const cardVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
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

  return (
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Box ref={threeJsRef} sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Box>
            <IconButton onClick={handleNotificationClick}>
              <motion.div whileHover={{ rotate: 20 }}>
                <Badge badgeContent={notificationCount} color="secondary">
                  <Notifications sx={{ color: theme.palette.secondary.main }} />
                </Badge>
              </motion.div>
            </IconButton>
            <Menu
              anchorEl={anchorElNotifications}
              open={Boolean(anchorElNotifications)}
              onClose={handleNotificationClose}
            >
              <MenuItem onClick={handleNotificationClose}>Notification 1</MenuItem>
              <MenuItem onClick={handleNotificationClose}>Notification 2</MenuItem>
              <MenuItem onClick={handleNotificationClose}>Notification 3</MenuItem>
            </Menu>
            <IconButton onClick={handleSettingsClick}>
              <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                <Settings sx={{ color: theme.palette.primary.main }} />
              </motion.div>
            </IconButton>
            <Menu
              anchorEl={anchorElSettings}
              open={Boolean(anchorElSettings)}
              onClose={handleSettingsClose}
            >
              <MenuItem onClick={handleSettingsClose}>Profile</MenuItem>
              <MenuItem onClick={handleSettingsClose}>Account</MenuItem>
              <MenuItem onClick={handleSettingsClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </motion.div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover="hover"
            variants={cardVariants}
          >
            <Paper sx={{ p: 2, height: '100%', background: theme.palette.background.paper, borderRadius: '15px', boxShadow: theme.shadows[10], backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Recent Activity</Typography>
              </Box>
              <List>
                <AnimatePresence>
                  {recentActivity.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListItem>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                          {item.icon}
                        </Avatar>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 'medium' }}>
                              {item.action}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              {item.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover="hover"
            variants={cardVariants}
          >
            <Paper sx={{ p: 2, height: '100%', background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 50%)`, borderRadius: '15px', boxShadow: theme.shadows[10], backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>Statistics</Typography>
              </Box>
              <List>
                {statistics.map((stat, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'medium' }}>
                          {stat.label}
                        </Typography>
                      }
                      secondary={
                        <Typography component="span" variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                          {stat.value}
                          <span style={{ color: stat.change.startsWith('+') ? theme.palette.success.light : theme.palette.error.light, fontWeight: 'bold' }}>{stat.change}</span>
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover="hover"
            variants={cardVariants}
          >
            <Paper sx={{ p: 2, height: '100%', background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`, borderRadius: '15px', boxShadow: theme.shadows[10], backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ mr: 1, color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>Quick Actions</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip title={action.label} placement="right">
                      <Button
                        variant="contained"
                        startIcon={action.icon}
                        onClick={action.action}
                        sx={{
                          mb: 2,
                          backgroundColor: action.color,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: action.color,
                            filter: 'brightness(110%)',
                          },
                          width: '100%',
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          padding: '12px 20px',
                          borderRadius: '10px',
                        }}
                      >
                        {action.label}
                      </Button>
                    </Tooltip>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper sx={{ p: 2, borderRadius: '15px', boxShadow: theme.shadows[10], backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>Analytics</Typography>
              <Charts />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
