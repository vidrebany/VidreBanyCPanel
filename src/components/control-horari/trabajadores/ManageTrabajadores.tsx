import { useEffect, useState } from "react";
import { Trabajador } from "./types/trabajadoresTypes";
import TrabajadoresList from "./TrabajadoresList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addTrabajador } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFetchWorkers from "../../../hooks/useFetchTrabajadores";
import { Api } from "../../../api/api";


const ManageTrabajadores = () => {
    const [trabajadorCodeSearch, setTrabajadorCodeSearch] = useState<string>("");
    const [filteredTrabajadores, setFilteredTrabajadores] = useState<Trabajador[]>([]);
    const [trabajadorCode, setTrabajadorCode] = useState<string>("");
    const [trabajadorName, setTrabajadorName] = useState<string>("");
    const [isAddingTrabajador, setIsAddingTrabajador] = useState<boolean>(false);


    const trabajadores = useSelector((state: RootState) => state.trabajadores.trabajadores);

    const dispatch = useDispatch();



    const handleSearch = () => {
        if (trabajadorCodeSearch === "") {
            setFilteredTrabajadores(trabajadores);
        } else {
            // Filter workers by code
            const filtered = trabajadores.filter((trabajador) => trabajador.code.toLowerCase().includes(trabajadorCodeSearch.toLowerCase()));
            setFilteredTrabajadores(filtered);
        }
    }

    useEffect(() => {
        setFilteredTrabajadores(trabajadores);
    }, [trabajadores])

    useFetchWorkers();

    const handleAddTrabajadorClick = () => {
        setIsAddingTrabajador(!isAddingTrabajador);
    };

    const handleAddTrabajador = async () => {
        if (trabajadorCode === "" || trabajadorName === "") return toast.error("Debes rellenar todos los campos");
        const newTrabajador: Trabajador = {
            name: trabajadorName,
            code: trabajadorCode
        };
        const res = await Api.post("/worker/create", newTrabajador)
            .catch((err) => {
                const error = (err.response.data.error);
                if (error.includes("duplicate")) {
                    toast.error("Ya existe un trabajador con ese código");
                    return;
                }
                toast.error("Error al crear trabajador:", error);
                return;
            });

        if (!res) return;
        dispatch(addTrabajador(res.data.worker));
        setIsAddingTrabajador(false);
        setTrabajadorCode("");
        setTrabajadorName("");
        toast.success("Trabajador añadido correctamente");
    };

    const navigate = useNavigate();



    return (
        <div className="d-flex flex-column align-items-center">
            <div>
                <h1>Gestión trabajadores</h1>
            </div>
            <button className="btn btn-primary align-self-start mb-2" onClick={() => navigate("/control-horari")}>Volver</button>
            {/*Input with code input to search workers*/}
            <div className="w-100">
                <div className="w-100 row justify-content-center">
                    <input value={trabajadorCodeSearch} onChange={(e) => setTrabajadorCodeSearch(e.target.value)} type="text" className="col form-control col-auto w-auto mb-2" placeholder="Código trabajador" />
                    <button onClick={handleSearch} className="col-auto btn btn-primary w-auto mb-2">Buscar</button>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <button onClick={handleAddTrabajadorClick} className={`btn btn-primary ${isAddingTrabajador && "btn-danger"} mb-2`}>Añadir trabajador</button>
                    </div>
                </div>
                {/* Collapse section for adding trabajador */}
                {isAddingTrabajador && (
                    <div id="addTrabajadorCollapse" className="collapse show">
                        <div className="card card-body">
                            <input value={trabajadorName} onChange={(e) => setTrabajadorName(e.target.value)} type="text" className="form-control mb-2" placeholder="Nombre del trabajador" />
                            <input value={trabajadorCode} onChange={(e) => setTrabajadorCode(e.target.value)} type="text" className="form-control mb-2" placeholder="Código del trabajador" />
                            <button onClick={handleAddTrabajador} className="btn btn-success">Crear trabajador</button>
                        </div>
                    </div>
                )}
            </div>
            <TrabajadoresList trabajadores={filteredTrabajadores} />
        </div>
    )
}

export default ManageTrabajadores