import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InventoryList from '../components/Inventory/InventoryList';
import InventoryForm from '../components/Inventory/InventoryForm';
import InventoryDetails from '../components/Inventory/InventoryDetails';

const Inventory = () => {
  return (
    <Routes>
      <Route path="/" element={<InventoryList />} />
      <Route path="/new" element={<InventoryForm />} />
      <Route path="/:id" element={<InventoryDetails />} />
      <Route path="/:id/edit" element={<InventoryForm />} />
    </Routes>
  );
};

export default Inventory;
