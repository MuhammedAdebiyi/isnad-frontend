import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import App from './App';
import InvoiceList from './InvoiceList';

function Main() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Isnad Invoice System</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Create Invoice</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/invoices">View Invoices</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/invoices" element={<InvoiceList />} />
      </Routes>
    </>
  );
}

export default Main;
