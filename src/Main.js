import { Routes, Route, Link } from 'react-router-dom';
import CreateInvoice from './CreateInvoice';
import InvoiceList from './InvoiceList';

function Main() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Isnad Invoice System</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
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
        <Route path="/" element={<CreateInvoice />} />
        <Route path="/invoices" element={<InvoiceList />} />
      </Routes>
    </>
  );
}

export default Main;
