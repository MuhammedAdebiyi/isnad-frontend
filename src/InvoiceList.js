import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceList({ onEditInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    customer_name: '',
    po_no: '',
    start_date: '',
    end_date: '',
  });

  // Fetch invoices whenever filters change
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(
          `https://isnad-backend-1.onrender.com/api/invoices/?${query}`,
          { withCredentials: true }
        );
        setInvoices(res.data);
      } catch (err) {
        console.error(err.response || err);
        alert('Error fetching invoices');
      }
    };

    fetchInvoices();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(
        `https://isnad-backend-1.onrender.com/api/invoices/${id}/delete/`,
        { withCredentials: true }
      );
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err) {
      console.error(err.response || err);
      alert('Error deleting invoice');
    }
  };

  const handleDownload = async (id, type) => {
    try {
      const res = await axios.get(
        `https://isnad-backend-1.onrender.com/api/invoices/${id}/download-${type}/`,
        { responseType: 'blob', withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err.response || err);
      alert(`Error downloading ${type.toUpperCase()}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Invoices</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name"
            name="customer_name"
            value={filters.customer_name}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="PO Number"
            name="po_no"
            value={filters.po_no}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>PO No</th>
            <th>Date</th>
            <th>Total (₦)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No invoices found</td>
            </tr>
          ) : (
            invoices.map((inv, index) => (
              <tr key={inv.id}>
                <td>{index + 1}</td>
                <td>{inv.invoice_no}</td>
                <td>{inv.customer_name}</td>
                <td>{inv.po_no}</td>
                <td>{inv.invoice_date}</td>
                <td>₦{inv.total.toLocaleString()}</td>
                <td>
                  <button className="btn btn-success btn-sm me-1" onClick={() => handleDownload(inv.id, 'pdf')}>PDF</button>
                  <button className="btn btn-info btn-sm text-white me-1" onClick={() => handleDownload(inv.id, 'docx')}>DOCX</button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => onEditInvoice(inv)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inv.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
