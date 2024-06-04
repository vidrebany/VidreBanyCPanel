import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import React from "react";
import App from "./App";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';

import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { NavbarProvider } from './components/NavbarContext'; // Importar el proveedor del contexto de la Navbar


const container = document.getElementById('root');
const root = createRoot(container!);

// Renderizar la aplicación en el root
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <NavbarProvider> {/* Envolver la aplicación en el proveedor del contexto de la Navbar */}
        <Navbar /> {/* Colocar el Navbar dentro del proveedor del contexto */}
        <App />
      </NavbarProvider>
    </Provider>
    <ToastContainer position="top-right" theme="colored" autoClose={15000} closeOnClick />
  </React.StrictMode>
);

reportWebVitals();
