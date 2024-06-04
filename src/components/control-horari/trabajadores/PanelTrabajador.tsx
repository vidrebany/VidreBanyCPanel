import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import useFetchWorkers from "../../../hooks/useFetchTrabajadores"
import { RootState } from "../../../redux/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectTrabajadorByCode } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { Api } from "../../../api/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavbar } from "../../NavbarContext"; // Importar el hook useNavbar del contexto de la Navbar

const PanelTrabajador = () => {

    const dispatch = useDispatch();
    const trabajadores = useSelector((state: RootState) => state.trabajadores.trabajadores);
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const [searchParams] = useSearchParams();
    const [currentDateTime, setCurrentDateTime] = useState('');
    const code = searchParams.get("code");
    const navigate = useNavigate();
    const { setNavbarVisible } = useNavbar(); // Obtener la función setNavbarVisible del contexto de la Navbar

    useEffect(() => {
        setNavbarVisible(false); // Ocultar la barra de navegación cuando el componente se monta
        return () => {
            setNavbarVisible(true); // Mostrar la barra de navegación cuando el componente se desmonta
        };
    }, [setNavbarVisible]); // Asegurar que el efecto se ejecute cuando setNavbarVisible cambie

    useEffect(() => {
        if (!selectedTrabajador) {
            if (code) {
                dispatch(selectTrabajadorByCode(code));
            }
        }
    }, [code, dispatch, selectedTrabajador, trabajadores]);

    useFetchWorkers();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const optionsDate: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit', timeZone: 'Europe/Madrid' };
            const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Madrid' };
            const formattedDate = new Intl.DateTimeFormat('es-ES', optionsDate).format(now);
            const formattedTime = new Intl.DateTimeFormat('es-ES', optionsTime).format(now);
            setCurrentDateTime(`Día: ${formattedDate} Hora: ${formattedTime}`);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const postTime = async (type: 'entry' | 'startRest' | 'endRest' | 'exit') => {
        const now = new Date();
        const isoDate = now.toISOString();
        const date = isoDate.slice(0, isoDate.indexOf('T'));
        const payload = {
            worker_code: selectedTrabajador?.code,
            date: date,
            type,
            time: now
        };
        try {
            const response = await Api.post('/worker/work_day', payload);
            console.log(response.data);
            toast.success('Hora registrada correctamente');
        } catch (error) {
            const axiosError = error as AxiosError;
            if (!axiosError) return console.log(error);
            if (!axiosError.response) return console.log(error);
            if (!axiosError.response.data) return console.log(error);
            const errorMessage = (axiosError.response.data as { error: string }).error;
            console.log(errorMessage);
            if (errorMessage.includes("NO HA INDICADO EL INICIO DEL DESCANSO")) {
                const now = new Date();
                const nowMinus30 = new Date(now.getTime() - 30 * 60000);
                const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' };
                const nowMinus30TimeString = new Intl.DateTimeFormat('es-ES', optionsTime).format(nowMinus30);
                toast.error(`NO HA INDICADO EL INICIO DEL DESCANSO, SE INDICA EL INICIO A LAS ${nowMinus30TimeString}`);
            } else {
                toast.error(errorMessage);
            }
        }
    };

    if (!selectedTrabajador) return <h1>Selecciona un trabajador</h1>;

    return (
        <div className="container">
            <h1 className="text-center mb-4">Panel Trabajador</h1>
            <button className="btn btn-primary" onClick={() => navigate("/control-horari/trabajadores/trabajador/entrada")}>Volver</button>
            <div className="mb-3">
                <label htmlFor="usuario" className="form-label">Usuario:</label>
                <input type="text" id="usuario" className="form-control" value={selectedTrabajador.name} readOnly />
            </div>
            <div className="d-flex justify-content-center gap-2 mb-3">
                <button type="button" className="btn btn-primary" onClick={() => postTime('entry')}><h2 className="text-white mb-0">Entrada</h2></button>
                {/* <button type="button" className="btn btn-secondary" onClick={() => postTime('startRest')}><h2 className="text-white mb-0">Inicio<br />Descanso</h2></button> */}
                {/* <button type="button" className="btn btn-secondary" onClick={() => postTime('endRest')}><h2 className="text-white mb-0">Final<br />Descanso</h2></button> */}
                <button type="button" className="btn btn-danger" onClick={() => postTime('exit')}><h2 className="text-white mb-0">Salida</h2></button>
            </div>
            <div className="position-absolute bottom-0 end-0 p-3">
                <span className="text-muted">{currentDateTime}</span>
            </div>
        </div>
    )
}

export default PanelTrabajador;
