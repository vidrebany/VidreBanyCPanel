import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { WorkingDay } from './types/trabajadoresTypes';
import { selectTrabajadorByCode } from '../../../redux/features/trabajadores/trabajadoresSlice';
import useFetchWorkers from '../../../hooks/useFetchTrabajadores';
import { Api } from '../../../api/api';
import { toast } from 'react-toastify';
import axios from 'axios';

const TrabajadorDetails = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const workers = useSelector((state: RootState) => state.trabajadores.trabajadores);
    // TODO: set dates to undefined
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined>("2023-12-22");
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined>("2023-12-28");
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);

    useFetchWorkers();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const fetchWorkedHours = async () => {
        //generate synthetic data
        //it has to contain 10 days
        //from 04/10/2023 to 14/10/2023 (don't use startDate and endDate for now)
        //enterHour 8:00
        //exitHour 18:00
        //startRestHour 13:00
        //endRestHour 14:00

        const res = await Api.get("/worker/work_days", {
            params: {
                worker_code: code,
                start_date: startDate,
                end_date: endDate
            }
        }).catch((err) => {
            const error = (err.response.data.error);
            toast.error("Error al obtener horario:", error);
            return;
        });
        if (!res) return;

        console.log(res)

        const generatedWorkingDays: WorkingDay[] = [];

        for (let i = 0; i < 10; i++) {
            generatedWorkingDays.push({
                date: new Date(2023, 10, 4 + i),
                enterHour: new Date(2023, 10, 4 + i, 8, 0),
                exitHour: new Date(2023, 10, 4 + i, 18, 0),
                startRestHour: new Date(2023, 10, 4 + i, 13, 0),
                endRestHour: new Date(2023, 10, 4 + i, 14, 0),
            })
        }

        console.log(generatedWorkingDays);
        setWorkingDays(generatedWorkingDays);


    }

    const calculateWorkedHours = (day: WorkingDay) => {
        const workDuration = (day.exitHour.getTime() - day.enterHour.getTime()) / (1000 * 60 * 60);
        const restDuration = (day.endRestHour.getTime() - day.startRestHour.getTime()) / (1000 * 60 * 60);
        return (workDuration - restDuration).toFixed(2);
    }

    useEffect(() => {
        if (startDate && endDate)
            fetchWorkedHours();
    }, [startDate, endDate])

    useEffect(() => {

        if (!selectedTrabajador) {
            if (code) {
                dispatch(selectTrabajadorByCode(code));
            }
        }
    }, [code, dispatch, selectedTrabajador, workers])

    if (!selectedTrabajador) {
        return <div>
            <button className="btn btn-primary align-items-start" onClick={() => navigate("/control-horari/trabajadores")}>Volver</button>
            Ningún trabajador seleccionado
        </div>;
    }



    return (
        <>
            <button className="btn btn-primary align-items-start" onClick={() => navigate("/control-horari/trabajadores")}>Volver</button>
            <div className="d-flex flex-column">
                <h1>Control horarios VidreBany</h1>
                <h2 className="ms-4 mb-4">Detalles trabajador</h2>
                <h3>Trabajador Seleccionado: {selectedTrabajador.name}</h3>

                <div className='d-flex flex-row align-items-center justify-content-center m-2'>
                    <div className="mb-3 me-2">
                        <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => {
                                alert(startDate)
                                setStartDate(e.target.value)
                            }}
                        />
                    </div>
                    <div className="mb-3 ms-2">
                        <label htmlFor="endDate" className="form-label">Fecha Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="d-flex flex-row align-items-center justify-content-center m-2">
                    <button className="btn btn-primary btn-block btn-info" onClick={() => navigate("/control-horari/trabajadores/trabajador-details/manage-schedule?code=" + selectedTrabajador.code)} style={{ width: "fit-content" }}><h3 style={{ display: "incline-block", verticalAlign: "top" }} className=" align-items-center justify-content-center text-white">Gestionar horario</h3></button>
                    <button onClick={() => alert("generando pdf")} className='btn btn-primary btn-block justify-content-center align-items-center m-2' style={{ width: "fit-content" }}><h3 style={{ display: "incline-block", verticalAlign: "top" }} className=" align-items-center justify-content-center text-white">Generar PDF</h3></button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora Entrada</th>
                            <th>Hora Salida</th>
                            <th>Hora Inicio Descanso</th>
                            <th>Hora Final Descanso</th>
                            <th>Horas Trabajadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingDays.map((day, index) => (
                            <tr key={index}>
                                <td>{format(day.date, 'dd/MM/yyyy')}</td>
                                <td>{format(day.enterHour, 'HH:mm')}</td>
                                <td>{format(day.exitHour, 'HH:mm')}</td>
                                <td>{format(day.startRestHour, 'HH:mm')}</td>
                                <td>{format(day.endRestHour, 'HH:mm')}</td>
                                <td>{calculateWorkedHours(day)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>SUMATORIO HORAS TRABAJADAS</td>
                            <td>{
                                workingDays.reduce((acc, day) => acc + parseFloat(calculateWorkedHours(day)), 0).toFixed(2)
                            }</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
};

export default TrabajadorDetails;