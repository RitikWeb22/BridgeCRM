import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Collapse,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon, Add as AddIcon, Download as DownloadIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const CreateInvoice = ({ addInvoice }) => {
  // ... (CreateInvoice component code remains unchanged)
};

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = () => {
      setLoading(true);
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
      } else {
        const dummyInvoices = [
          { id: 'INV-001', date: '2023-05-01', customer: 'John Doe', total: 100.00, items: [{ name: 'Sample Item 1', quantity: 1, unitPrice: 100.00 }] },
          { id: 'INV-002', date: '2023-05-02', customer: 'Jane Smith', total: 150.50, items: [{ name: 'Sample Item 2', quantity: 1, unitPrice: 150.50 }] },
          { id: 'INV-003', date: '2023-05-03', customer: 'Bob Johnson', total: 200.75, items: [{ name: 'Sample Item 3', quantity: 1, unitPrice: 200.75 }] },
        ];
        setInvoices(dummyInvoices);
        setFilteredInvoices(dummyInvoices);
        localStorage.setItem('invoices', JSON.stringify(dummyInvoices));
      }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    const results = invoices.filter(invoice =>
      (invoice.customer && invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.id && invoice.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.date && invoice.date.includes(searchTerm))
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const handleDelete = (id) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setSnackbarMessage('Invoice deleted successfully');
    setOpenSnackbar(true);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(JSON.parse(JSON.stringify(invoice)));
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setSelectedInvoice(null);
  };

  const handleSaveEdit = () => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === selectedInvoice.id ? selectedInvoice : invoice
    );
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    handleCloseDialog();
    setSnackbarMessage('Invoice updated successfully');
    setOpenSnackbar(true);
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setSelectedInvoice(prevState => {
      const updatedInvoice = { ...prevState };
      if (name === 'date' || name === 'customer') {
        updatedInvoice[name] = value;
      } else if (index !== undefined && updatedInvoice.items && Array.isArray(updatedInvoice.items)) {
        updatedInvoice.items[index] = {
          ...updatedInvoice.items[index],
          [name]: name === 'quantity' ? parseInt(value) : name === 'unitPrice' ? parseFloat(value) : value
        };
      }
      
      // Recalculate total
      if (updatedInvoice.items && Array.isArray(updatedInvoice.items)) {
        updatedInvoice.total = updatedInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      } else {
        updatedInvoice.total = 0;
      }
      
      return updatedInvoice;
    });
  };

  const handleAddItem = () => {
    setSelectedInvoice(prevState => {
      const newItem = { name: 'New Item', quantity: 1, unitPrice: 0 };
      const updatedItems = prevState.items && Array.isArray(prevState.items) ? [...prevState.items, newItem] : [newItem];
      const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      return {
        ...prevState,
        items: updatedItems,
        total: updatedTotal
      };
    });
  };

  const handleRemoveItem = (index) => {
    setSelectedInvoice(prevState => {
      if (!prevState.items || !Array.isArray(prevState.items)) {
        return prevState;
      }
      const updatedItems = prevState.items.filter((_, i) => i !== index);
      const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      return {
        ...prevState,
        items: updatedItems,
        total: updatedTotal
      };
    });
  };

  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();
    
    // Add company logo
    // doc.addImage(companyLogo, 'PNG', 10, 10, 50, 50);
    
    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    
    // Add invoice title
    doc.text("INVOICE", 105, 20, null, null, "center");
    
    // Reset font style
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Add invoice details
    doc.text(`Invoice #: ${invoice.id}`, 20, 40);
    doc.text(`Date: ${invoice.date}`, 20, 50);
    doc.text(`Customer: ${invoice.customer}`, 20, 60);
    
    // Add a line
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);
    
    // Add table for invoice items
    doc.autoTable({
      startY: 80,
      head: [['Item', 'Quantity', 'Unit Price', 'Total']],
      body: invoice.items && Array.isArray(invoice.items) ? invoice.items.map(item => [
        item.name,
        item.quantity.toString(),
        `$${typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : '0.00'}`,
        `$${typeof item.quantity === 'number' && typeof item.unitPrice === 'number' ? (item.quantity * item.unitPrice).toFixed(2) : '0.00'}`
      ]) : [],
      theme: 'striped',
    });
    
    // Add total
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}`, 150, doc.lastAutoTable.finalY + 20);
    
    // Add footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 280, null, null, "center");
    
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const addInvoice = (newInvoice) => {
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setSnackbarMessage('Invoice created successfully');
    setOpenSnackbar(true);
  };

  const handleExpandRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Routes>
        <Route path="/" element={
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Invoices</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Search invoices"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ mr: 2, width: '300px', backgroundColor: 'white' }}
                  InputProps={{
                    sx: { borderRadius: '20px' }
                  }}
                />
                <Button
                  component={Link}
                  to="/invoices/new"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Create New Invoice
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Table sx={{ minWidth: 650 }} aria-label="invoice table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell>Invoice #</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell align="right">Total</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <React.Fragment key={invoice.id}>
                      <StyledTableRow>
                        <StyledTableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleExpandRow(invoice.id)}
                          >
                            {expandedRows[invoice.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">{invoice.id}</StyledTableCell>
                        <StyledTableCell>{invoice.date}</StyledTableCell>
                        <StyledTableCell>{invoice.customer}</StyledTableCell>
                        <StyledTableCell align="right">${typeof invoice.total === 'number' ? invoice.total.toFixed(2) : '0.00'}</StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton
                            onClick={() => handleView(invoice)}
                            color="primary"
                            size="small"
                            aria-label="view"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEdit(invoice)}
                            color="primary"
                            size="small"
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this invoice?')) {
                                handleDelete(invoice.id);
                              }
                            }}
                            color="error"
                            size="small"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDownloadPDF(invoice)}
                            color="primary"
                            size="small"
                            aria-label="download"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={expandedRows[invoice.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Invoice Items
                              </Typography>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Unit Price</TableCell>
                                    <TableCell align="right">Total Price</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {invoice.items && invoice.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell component="th" scope="row">
                                        {item.name}
                                      </TableCell>
                                      <TableCell align="right">{item.quantity}</TableCell>
                                      <TableCell align="right">${typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : '0.00'}</TableCell>
                                      <TableCell align="right">
                                        ${typeof item.quantity === 'number' && typeof item.unitPrice === 'number' ? (item.quantity * item.unitPrice).toFixed(2) : '0.00'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        } />
        <Route path="/new" element={<CreateInvoice addInvoice={addInvoice} />} />
      </Routes>
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          {isEditing ? 'Edit Invoice' : 'Invoice Details'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedInvoice && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="primary">Invoice #{selectedInvoice.id}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  label="Date"
                  name="date"
                  value={selectedInvoice.date}
                  onChange={(e) => handleInputChange(e)}
                  disabled={!isEditing}
                />
                <TextField
                  label="Customer"
                  name="customer"
                  value={selectedInvoice.customer}
                  onChange={(e) => handleInputChange(e)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Invoice Items:</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        {isEditing && <TableCell align="center">Actions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.items && Array.isArray(selectedInvoice.items) && selectedInvoice.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              value={item.name}
                              onChange={(e) => handleInputChange(e, index)}
                              name="name"
                              disabled={!isEditing}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              value={item.quantity}
                              onChange={(e) => handleInputChange(e, index)}
                              name="quantity"
                              type="number"
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              value={item.unitPrice}
                              onChange={(e) => handleInputChange(e, index)}
                              name="unitPrice"
                              type="number"
                              disabled={!isEditing}
                            />
                          </TableCell>
                          <TableCell align="right">${typeof item.quantity === 'number' && typeof item.unitPrice === 'number' ? (item.quantity * item.unitPrice).toFixed(2) : '0.00'}</TableCell>
                          {isEditing && (
                            <TableCell align="center">
                              <IconButton
                                onClick={() => handleRemoveItem(index)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {isEditing && (
                  <Button
                    onClick={handleAddItem}
                    color="primary"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Add Item
                  </Button>
                )}
              </Box>
              <Typography variant="h6" align="right">Total: ${typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : '0.00'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
          {isEditing && (
            <Button onClick={handleSaveEdit} color="primary">
              Save Changes
            </Button>
          )}
          {!isEditing && selectedInvoice && (
            <Button onClick={() => handleDownloadPDF(selectedInvoice)} color="primary" startIcon={<DownloadIcon />}>
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default InvoiceList;
