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
 import Usuaris from "./components/user/Usuaris";
 import Processes from "./components/process/Processes";
 import Process from "./components/process/Process";
import Ordres from "./components/Ordres";
import User from "./components/user/User";
import Transport from "./components/transports/Transport"
import Transporters from "./components/transports/Transporters"
import AddTransportOrder from "./components/transports/AddTransportOrder"
import Incidencies from "./components/incidencies/Incidencies"
import AddIncidencia from "./components/incidencies/AddIncidencia"
import IncidenciesObertes from "./components/incidencies/IncidenciesObertes"
import EditInconformitat from "./components/incidencies/EditInconformitat"
import Admins from "./components/admins/Admins"

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
  <Route path="/incidencies" element={<Incidencies />} />
  <Route path="/addincidencia" element={<AddIncidencia />} />
  <Route path="/incidenciesobertes" element={<IncidenciesObertes />} />
  <Route path="/editinconformitat" element={<EditInconformitat />} />
  <Route path="/admins" element={<Admins />} />
</Routes>
</HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


