// App.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const initialInvoice = {
    customer_name: '',
    customer_address: '',
    contract_no: '',
    po_no: '',
    invoice_date: '',
    vat_date: '',
    vat: 0,
    wht: 0,
    items: [{ description: '', unit: '', qty: 1, unit_rate: 0 }]
  };

  const [invoice, setInvoice] = useState(initialInvoice);
  const [savedInvoice, setSavedInvoice] = useState(null);

  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      const newItems = [...invoice.items];
      newItems[index][field] = e.target.value;
      setInvoice({ ...invoice, items: newItems });
    } else {
      setInvoice({ ...invoice, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', unit: '', qty: 1, unit_rate: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: newItems });
  };

  const calculateTotal = () =>
    invoice.items.reduce((acc, item) => acc + item.qty * item.unit_rate, 0);

  const grandTotal = () => {
    const total = calculateTotal();
    const vat = parseFloat(invoice.vat || 0);
    const wht = parseFloat(invoice.wht || 0);
    return total + vat - wht;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/invoices/create/', invoice);
      alert(`Invoice ${res.data.invoice_no} saved!`);
      setSavedInvoice({ id: res.data.invoice_id, invoice_no: res.data.invoice_no });
    } catch (err) {
      console.error(err);
      alert('Error saving invoice');
    }
  };

  const handleDownload = async (type) => {
    if (!savedInvoice) return;
    try {
      const url = `http://127.0.0.1:8000/api/invoices/${savedInvoice.id}/download-${type}/`;
      const res = await axios.get(url, { responseType: 'blob' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([res.data]));
      link.setAttribute('download', `${savedInvoice.invoice_no}.${type}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert(`Error downloading ${type.toUpperCase()}`);
    }
  };

  const resetForm = () => {
    setInvoice(initialInvoice);
    setSavedInvoice(null);
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Create Invoice</h2>
          {savedInvoice && <h5 className="mb-0">Invoice No: {savedInvoice.invoice_no}</h5>}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Customer Info */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="customer_name"
                  value={invoice.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Contract No</label>
                <input
                  type="text"
                  className="form-control"
                  name="contract_no"
                  value={invoice.contract_no}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Customer Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="customer_address"
                  value={invoice.customer_address}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">PO No</label>
                <input
                  type="text"
                  className="form-control"
                  name="po_no"
                  value={invoice.po_no}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Invoice Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="invoice_date"
                  value={invoice.invoice_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">VAT Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="vat_date"
                  value={invoice.vat_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Items Table */}
            <h4 className="mt-4">Items</h4>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th>Unit Rate (₦)</th>
                    <th>Amount (₦)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.description}
                          onChange={(e) => handleChange(e, index, 'description')}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.unit}
                          onChange={(e) => handleChange(e, index, 'unit')}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.qty}
                          onChange={(e) => handleChange(e, index, 'qty')}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.unit_rate}
                          onChange={(e) => handleChange(e, index, 'unit_rate')}
                        />
                      </td>
                      <td>₦{(item.qty * item.unit_rate).toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* WHT, VAT, Grand Total */}
            <div className="row g-3 mt-2">
              <div className="col-12 col-md-4">
                <label className="form-label">WHT (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  name="wht"
                  value={invoice.wht}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">VAT (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  name="vat"
                  value={invoice.vat}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end">
                <h5 className="mb-0">Grand Total: ₦{grandTotal().toLocaleString()}</h5>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                Add Item
              </button>
              <button type="submit" className="btn btn-primary">
                Save Invoice
              </button>
              <button type="button" className="btn btn-warning" onClick={resetForm}>
                New Invoice
              </button>
              {savedInvoice && (
                <>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleDownload('pdf')}
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-info text-white"
                    onClick={() => handleDownload('docx')}
                  >
                    Download DOCX
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
