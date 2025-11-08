import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvoiceList from './InvoiceList';
import App from './App'; // Create Invoice Page

function Main() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Invoice System</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Create Invoice</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/invoices">View Invoices</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/invoices" element={<InvoiceList />} />
      </Routes>
    </Router>
  );
}

export default Main;
