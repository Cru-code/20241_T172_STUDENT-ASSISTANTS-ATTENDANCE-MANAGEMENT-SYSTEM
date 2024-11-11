import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";

import App from '../src/App.jsx';
// import AdminDashboard from '../pages/AdminDashboard.jsx';

// import UserDashboard from '../pages/UserDashboard.jsx';

// import App from './App.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
