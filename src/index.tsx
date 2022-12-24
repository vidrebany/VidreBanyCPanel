import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { 
  Routes,
  HashRouter,
  Route,
 } from 'react-router-dom';
 import Usuaris from "./components/Usuaris";
 import Processes from "./components/Processes";
 import Process from "./components/Process";
import Ordres from "./components/Ordres";
import User from "./components/User";
import Transport from "./components/Transport"
import Transporters from "./components/Transporters"
import AddTransportOrder from "./components/AddTransportOrder"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  
);

root.render(
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

<HashRouter>
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/processes" element={<Processes />} />
  <Route path="/users" element={<Usuaris />} />
  <Route path="/edit" element={<Ordres />} />
  <Route path="/user" element={<User />} />
  <Route path="/process" element={<Process />} />
  <Route path="/transport" element={<Transport />} />
  <Route path="/transporters" element={<Transporters />} />
  <Route path="/addtransportorder" element={<AddTransportOrder />} />
</Routes>
</HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


