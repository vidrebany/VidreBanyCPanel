import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";


const ServeiTecnic = () => {
    const navigate = useNavigate();
    return (
        <div className="container tecnic">
            <Navbar />
            <h1>Administració servei tècnic</h1>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/tecnicslist")}>Llistat tècnics</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/addserveitecnic")}>Afegir servei tècnic</button>
        </div>
    );
}

export default ServeiTecnic;