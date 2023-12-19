import './index.css';
import MainMenu from './MainMenu';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";

import {
  Routes,
  HashRouter,
  Route,
} from 'react-router-dom';
import Usuaris from "./components/user/Usuaris";
import Processes from "./components/process/Processes";
import Process from "./components/process/Process";
import StandBy from "./components/process/StandBy";
import Ordres from "./components/Ordres";
import OrdresRefactored from "./components/OrdresRefactored";
import User from "./components/user/User";
import Transport from "./components/transports/Transport"
import Transporters from "./components/transports/Transporters"
import AddTransportOrder from "./components/transports/AddTransportOrder"
import Incidencies from "./components/incidencies/Incidencies"
import AddIncidencia from "./components/incidencies/AddIncidencia"
import EditInconformitat from "./components/incidencies/EditInconformitat"
import EditTransport from "./components/transports/EditTransport"
import Admins from "./components/admins/Admins"
import ServeisTecnics from "./components/tecnic/ServeisTecnics"
import AddServeiTecnic from "./components/tecnic/AddServeiTecnic"
import TecnicsList from "./components/tecnic/TecnicsList"
import ViewServeiTecnic from './components/tecnic/ViewServeiTecnic';
import ControlHorari from './components/control-horari/ControlHorari';
import ManageTrabajadores from './components/control-horari/trabajadores/ManageTrabajadores';
import TrabajadorDetails from './components/control-horari/trabajadores/TrabajadorDetails';

const App = () => {

      return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/processes" element={<Processes />} />
          <Route path="/users" element={<Usuaris />} />
          <Route path="/edit" element={<Ordres />} />
          <Route path="/editrefactored" element={<OrdresRefactored />} />
          <Route path="/user" element={<User />} />
          <Route path="/process" element={<Process />} />
          <Route path="/standby" element={<StandBy />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/transporters" element={<Transporters />} />
          <Route path="/addtransportorder" element={<AddTransportOrder />} />
          <Route path="/incidencies" element={<Incidencies />} />

          <Route path="/control-horari" element={<ControlHorari />} />
          <Route path="/control-horari/trabajadores" element={<ManageTrabajadores />} />
          <Route path="/control-horari/trabajadores/trabajador-details" element={<TrabajadorDetails />} />

          <Route path="/addincidencia" element={<AddIncidencia />} />
          <Route path="/editinconformitat" element={<EditInconformitat />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/transport/edittransport" element={<EditTransport />} />
          <Route path="/tecnic" element={<ServeisTecnics />} />
          <Route path="/tecnic/addserveitecnic" element={<AddServeiTecnic />} />
          <Route path="/tecnic/tecnicslist" element={<TecnicsList />} />
          <Route path="/tecnic/viewserveitecnic" element={<ViewServeiTecnic />} />
        </Routes>
      </HashRouter>
    );
}


export default App;