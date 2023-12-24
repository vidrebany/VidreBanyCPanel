import { useSelector } from "react-redux";
import useFetchWorkers from "../../../hooks/useFetchTrabajadores";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EntradaTrabajador = () => {

    const trabajadores = useSelector((state: RootState) => state.trabajadores.trabajadores);
    const [trabajadorCode, setTrabajadorCode] = useState<string>("");
    const navigate = useNavigate();

    useFetchWorkers();

    return (
        <div>
            <h1>Entrada Trabajador</h1>
            <button className="btn btn-primary" onClick={() => navigate("/control-horari")}>Volver</button>
            {trabajadorCode !== "" && trabajadores.find((trabajador) => trabajador.code === trabajadorCode) && <h2 className="ms-4">{trabajadores.find((trabajador) => trabajador.code === trabajadorCode)?.name}</h2>}
            <div className="d-flex flex-row justify-content-center ms-4">
                <input value={trabajadorCode} onChange={(e) => setTrabajadorCode(e.target.value)} type="text" className="form-control mb-2 mt-2 ml-4" placeholder="Código del trabajador" />
                <button disabled={!Boolean(trabajadorCode !== "" && trabajadores.find((trabajador) => trabajador.code === trabajadorCode))} className="btn btn-primary" onClick={() => navigate("/control-horari/trabajadores/trabajador?code=" + trabajadorCode)}>Entrada</button>
            </div>
        </div>
    )
}

export default EntradaTrabajador