// Import this if you are using react-bootstrap library
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Navbar />
      <h1>Panel VidreBany</h1>
      <p>Administració d'ordres, processos i usuaris.</p>
    </div>
  );
}


export default App;