import React, { useEffect, useState } from "react";
import { Trabajador } from "./types/trabajadoresTypes";
import TrabajadoresList from "./TrabajadoresList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addTrabajador } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, push, set } from 'firebase/database'; // Importa los módulos de Firebase Database

const ManageTrabajadores = () => {
    const db = getDatabase(); // Obtiene la instancia de la base de datos de Firebase
    const [trabajadorCodeSearch, setTrabajadorCodeSearch] = useState<string>("");
    const [filteredTrabajadores, setFilteredTrabajadores] = useState<Trabajador[]>([]);
    const [trabajadorCode, setTrabajadorCode] = useState<string>("");
    const [trabajadorName, setTrabajadorName] = useState<string>("");
    const [isAddingTrabajador, setIsAddingTrabajador] = useState<boolean>(false);

    const trabajadores = useSelector((state: RootState) => state.trabajadores.trabajadores);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const trabajadoresRef = ref(db, "trabajadores"); // Obtén la referencia a la colección "trabajadores"
        const handleData = (snapshot: any) => { // Cambia any por el tipo correcto si es posible
            const data = snapshot.val();
            if (data) {
                const trabajadoresArray: Trabajador[] = Object.values(data);
                setFilteredTrabajadores(trabajadoresArray);
                dispatch(addTrabajador(trabajadoresArray[0])); // Pasar solo el primer trabajador del array
            }
        };
        const offCallback = onValue(trabajadoresRef, handleData); // Escucha los cambios en la base de datos

        return () => { 
            // Detiene la escucha cuando el componente se desmonta
            offCallback(); 
        };
    }, [db, dispatch]);

    const handleSearch = () => {
        if (trabajadorCodeSearch === "") {
            setFilteredTrabajadores(trabajadores);
        } else {
            const filtered = trabajadores.filter((trabajador) => trabajador.code.toLowerCase().includes(trabajadorCodeSearch.toLowerCase()));
            setFilteredTrabajadores(filtered);
        }
    };

    const handleAddTrabajadorClick = () => {
        setIsAddingTrabajador(!isAddingTrabajador);
    };

    const handleAddTrabajador = async () => {
        if (trabajadorCode === "" || trabajadorName === "") return toast.error("Debes rellenar todos los campos");

        try {
            const trabajadorRef = push(ref(db, "trabajadores")); // Genera una nueva referencia en la colección "trabajadores"
            await set(trabajadorRef, { // Establece los datos en la nueva referencia
                name: trabajadorName,
                code: trabajadorCode
            });
            setIsAddingTrabajador(false);
            setTrabajadorCode("");
            setTrabajadorName("");
            toast.success("Trabajador añadido correctamente");
        } catch (error) {
            console.error("Error al crear trabajador:", error);
            toast.error("Error al crear trabajador");
        }
    };

    return (
        <div>
        <div className="d-flex flex-column align-items-center">
            <div>
                <h1>Gestión trabajadoress</h1>
            </div>
            <button className="btn btn-primary align-self-start mb-2" onClick={() => navigate("/control-horari")}>Volver</button>
            <div className="w-100">
                <div className="w-100 row justify-content-center">
                    <input value={trabajadorCodeSearch} onChange={(e) => setTrabajadorCodeSearch(e.target.value)} type="text" className="col form-control col-auto w-auto mb-2" placeholder="Código trabajador" />
                    <button onClick={handleSearch} className="col-auto btn btn-primary w-auto mb-2">Buscar</button>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <button onClick={handleAddTrabajadorClick} className={`btn btn-primary ${isAddingTrabajador && "btn-danger"} mb-2`}> Añadir trabajador</button>
                    </div>
                </div>
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
            <TrabajadoresList/>
        </div>
        </div>
    );
};

export default ManageTrabajadores;