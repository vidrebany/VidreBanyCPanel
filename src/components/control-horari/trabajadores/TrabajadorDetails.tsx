import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { WorkingDay } from './types/trabajadoresTypes';

const TrabajadorDetails = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined>(undefined);
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);

    const navigate = useNavigate();

    const fetchWorkedHours = async () => {
        //generate synthetic data
        //it has to contain 10 days
        //from 04/10/2023 to 14/10/2023 (don't use startDate and endDate for now)
        //enterHour 8:00
        //exitHour 18:00
        //startRestHour 13:00
        //endRestHour 14:00

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
                            onChange={(e) => setStartDate(e.target.value)}
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