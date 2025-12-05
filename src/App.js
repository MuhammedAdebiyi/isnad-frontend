import React, { useState } from 'react';
import Login from './Login';
import CreateInvoice from './CreateInvoice.js';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('access_token'));

  return loggedIn ? (
    <CreateInvoice />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
