// Import this if you are using react-bootstrap library
import { Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./App.css";

import "./App.css";
import Navbar from "./components/Navbar";


function App() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Navbar />
      <h1>Panel VidreBany</h1>
      <p className="display-6">Menú d'operacions:</p>
      <div className="d-flex flex-column justify-content-center">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/processes')}>PROCESSOS</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/users')}>USUARIS</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/edit')}>ORDRES</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/transport')}>TRANSPORTS</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/incidencies')}>NO CONFORMITATS</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/admins')}>ADMINISTRADORS</button>
      </div>
    </div>
  );
}


export default App;