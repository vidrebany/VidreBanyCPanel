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
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined>("2024-01-05");
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
    const [editMode, setEditMode] = useState({ date: false, time: false, dayIndex: -1, field: '' });

    const handleRemoveWorkday = async (day: WorkingDay) => {

        const isoDate = day.date.toISOString();
        const date = isoDate.slice(0, isoDate.indexOf('T'));

        const res = await Api.delete(`/worker/work_day/delete?worker_code=${selectedTrabajador?.code}&date=${date}`).catch((err) => {
            const error = (err.response.data.error);
            toast.error("Error al eliminar día de trabajo:", error);
            return;
        });

        if (!res) return;

        toast.success("Día de trabajo eliminado correctamente");
        fetchWorkedHours(startDate, endDate);
    }

    type WorkingDayField = 'date' | 'enterHour' | 'exitHour' | 'startRestHour' | 'endRestHour';

    // Handler to toggle edit mode
    const toggleEditMode = (index: number, field: WorkingDayField) => {
        setEditMode({ date: field.includes('date'), time: field.includes('Hour'), dayIndex: index, field });
    };

    // Handler to save the changed value
    const handleSaveChange = async (e: React.ChangeEvent<HTMLInputElement>, day: WorkingDay, field: WorkingDayField) => {
        // Update the specific day's field with the new value
        // Make sure to clone the array and update the state accordingly
        let newDate: Date | string;

        if (field === 'date') {
            // For date field, create a new Date directly from the input value
            newDate = new Date(e.target.value);
            const isoDate = newDate.toISOString();
            newDate = isoDate.slice(0, isoDate.indexOf('T'));
        } else {
            // For time fields, combine the time value with the existing date
            const timeParts = e.target.value.split(':');
            newDate = new Date(day.date);
            newDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
        }

        //make a request to /worker/work_day/update with the worker code, date, type and time
        const isoDate = day.date.toISOString();
        const date = isoDate.slice(0, isoDate.indexOf('T'));

        const payload = {
            worker_code: selectedTrabajador?.code,
            date: date,
            type: field,
            time: newDate
        }

        const res = await Api.put('/worker/work_day/update', payload)
            .catch((err) => {
                const error = (err.response.data.error);
                toast.error("Error al registrar hora:", error);
                return;
            });
        if (!res) return;
        console.log(res.data);
        toast.success('Hora registrada correctamente');

        const newWorkingDays = [...workingDays];
        newWorkingDays[editMode.dayIndex] = { ...day, [field]: field !== 'date' ? newDate : new Date(newDate) };
        console.log(newWorkingDays)
        setWorkingDays(newWorkingDays);

        // Log the change
        console.log(`Changed ${field} to: `, e.target.value);

        // Exit edit mode
        setEditMode({ date: false, time: false, dayIndex: -1, field: '' });
    };


    useFetchWorkers();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const fetchWorkedHours = async (startDate: string | number | readonly string[] | undefined, endDate: string | number | readonly string[] | undefined) => {
        //startDate 2023-12-22
        //endDate 2024-01-05


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

        const obtainedWorkingDays: WorkingDay[] = res.data.work_schedules.map((work_schedule: any) => {
            const date = new Date(work_schedule.date);
            const entry_hour = new Date(work_schedule.entry_hour);
            const exit_hour = new Date(work_schedule.exit_hour);
            const rest_start_hour = new Date(work_schedule.rest_start_hour);
            const rest_end_hour = new Date(work_schedule.rest_end_hour);

            return {
                date,
                enterHour: entry_hour,
                exitHour: exit_hour,
                startRestHour: rest_start_hour,
                endRestHour: rest_end_hour
            }
        });

        setWorkingDays(obtainedWorkingDays);


    }

    const calculateWorkedHours = (day: WorkingDay) => {
        const workDuration = (day.exitHour.getTime() - day.enterHour.getTime()) / (1000 * 60 * 60);
        const restDuration = (day.endRestHour.getTime() - day.startRestHour.getTime()) / (1000 * 60 * 60);
        return (workDuration - restDuration).toFixed(2);
    }

    useEffect(() => {
        if (startDate && endDate)
            fetchWorkedHours(startDate, endDate);
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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingDays.map((day, index) => (
                            <tr key={index}>
                                <td onClick={() => toggleEditMode(index, 'date')}>
                                    {editMode.dayIndex === index && editMode.field === 'date' ?
                                        <input type="date" value={format(day.date, 'yyyy-MM-dd')} onChange={(e) => handleSaveChange(e, day, 'date')} />
                                        :
                                        format(day.date, 'dd/MM/yyyy')
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'enterHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'enterHour' ?
                                        <input type="time" value={format(day.enterHour, 'HH:mm')} onChange={(e) => handleSaveChange(e, day, 'enterHour')} />
                                        :
                                        format(day.enterHour, 'HH:mm')
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'exitHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'exitHour' ?
                                        <input type="time" value={format(day.exitHour, 'HH:mm')} onChange={(e) => handleSaveChange(e, day, 'exitHour')} />
                                        :
                                        format(day.exitHour, 'HH:mm')
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'startRestHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'startRestHour' ?
                                        <input type="time" value={format(day.startRestHour, 'HH:mm')} onChange={(e) => handleSaveChange(e, day, 'startRestHour')} />
                                        :
                                        format(day.startRestHour, 'HH:mm')
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'endRestHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'endRestHour' ?
                                        <input type="time" value={format(day.endRestHour, 'HH:mm')} onChange={(e) => handleSaveChange(e, day, 'endRestHour')} />
                                        :
                                        format(day.endRestHour, 'HH:mm')
                                    }
                                </td>
                                <td>{calculateWorkedHours(day)}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleRemoveWorkday(day)}>Eliminar</button>
                                </td>
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