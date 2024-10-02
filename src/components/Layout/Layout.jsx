import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, ml: { sm: `240px` } }}>
        <Toolbar /> {/* This empty Toolbar pushes content below the app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
