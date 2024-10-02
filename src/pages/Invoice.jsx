import React from 'react';
import { Routes, Route } from 'react-router-dom';

import InvoiceList from '../components/invoice/InvoiceList';
import InvoiceForm from '../components/invoice/InvoiceForm';
import InvoiceDetail from '../components/invoice/InvoiceDetail';

const Invoice = () => {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path=":id/edit" element={<InvoiceForm />} />
    </Routes>
  );
};

export default Invoice;
