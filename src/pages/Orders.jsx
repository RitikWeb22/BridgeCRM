import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from '../components/Orders/OrderList';
import OrderForm from '../components/Orders/OrderForm';
import OrderDetails from '../components/Orders/OrderDetails';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (updatedOrder) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <Routes>
      <Route path="/" element={<OrderList orders={orders} deleteOrder={deleteOrder} />} />
      <Route path="/new" element={<OrderForm addOrder={addOrder} />} />
      <Route path="/:id" element={<OrderDetails orders={orders} />} />
      <Route path="/:id/edit" element={<OrderForm orders={orders} updateOrder={updateOrder} />} />
    </Routes>
  );
};

export default Orders;
