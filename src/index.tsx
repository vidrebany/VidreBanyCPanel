
import { store } from './redux/store';
/*
<BrowserRouter basename="VidreBanyCPanel">
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/processes" element={<Processes />} />
    <Route path="/users" element={<Usuaris />} />
    <Route path="/edit" element={<Ordres />} />
    <Route path="/user" element={<User />} />
    <Route path="/process" element={<Process />} />
  </Routes>
</BrowserRouter>

*/

import reportWebVitals from './reportWebVitals';
import React from "react";
import App from "./App";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'; // Updated import

import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const container = document.getElementById('root');
const root = createRoot(container!);


// Render the app on the root
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <App />
    </Provider>
    <ToastContainer position="top-right" theme="colored" closeOnClick />
  </React.StrictMode>
);


/*
ReactDOM.render(
  <React.StrictMode>
    <>
      <Provider store={store}>
        <Navbar />
        <App />
      </Provider>
      <ToastContainer position="top-right" theme="colored" closeOnClick />
    </>
  </React.StrictMode>,
  document.getElementById('root')
)

*/

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


