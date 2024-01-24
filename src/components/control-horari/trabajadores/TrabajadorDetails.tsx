import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DayType, ExtraHours, HourLimits, WorkingDay } from './types/trabajadoresTypes';
import { selectTrabajadorByCode } from '../../../redux/features/trabajadores/trabajadoresSlice';
import useFetchWorkers from '../../../hooks/useFetchTrabajadores';
import { Api } from '../../../api/api';
import { toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExtraWorkDaysPDF from './pdf/ExtraWorkDaysPDF';
import WorkDaysPDF from './pdf/WorkDaysPDF';
import { fetchExtraHours } from './fetchExtraHours';


export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const deepCopy = (obj: any): {} => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (Array.isArray(obj)) {
        const copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    if (typeof obj === 'object') {
        const copy = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj === 'object') {
                    const copy: { [key: string]: any } = {};
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            copy[key] = deepCopy(obj[key]);
                        }
                    }
                    return copy;
                }
            }
        }
        return copy;
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
}


export const calculateWorkedHours = (day: WorkingDay) => {
    if (!day.enterHour || !day.exitHour) return (0).toFixed(2);
    const workDuration = (day.exitHour.getTime() - day.enterHour.getTime()) / (1000 * 60 * 60);

    let breakfastTime = 0;
    if (day.startBreakfastHour && day.endBreakfastHour)
        breakfastTime = (day.endBreakfastHour.getTime() - day.startBreakfastHour.getTime()) / (1000 * 60 * 60);
    let lunchTime = 0;
    if (day.startLunchHour && day.endLunchHour)
        lunchTime = (day.endLunchHour.getTime() - day.startLunchHour.getTime()) / (1000 * 60 * 60);

    const restDuration = breakfastTime + lunchTime;

    return (workDuration - restDuration).toFixed(2);
}






const TrabajadorDetails = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const workers = useSelector((state: RootState) => state.trabajadores.trabajadores);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    // TODO: set dates to undefined
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined>("2023-12-22");
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined>("2024-02-05");
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
    const [editMode, setEditMode] = useState({ date: false, time: false, dayIndex: -1, field: '' });
    const [newWorkday, setNewWorkday] = useState({
        date: '',
        enterHour: '',
        exitHour: '',
        startBreakfastHour: '',
        endBreakfastHour: '',
        startLunchHour: '',
        endLunchHour: ''
    });
    const [showAddDay, setShowAddDay] = useState(false);
    const [extraHours, setExtraHours] = useState<ExtraHours[]>([]);
    const [hourLimits, setHourLimits] = useState<HourLimits>({
        laborable: { minEntryHour: '5:00', maxEntryHour: '5:00', minExitHour: '20:30', maxExitHour: '20:30' },
        viernes: { minEntryHour: '5:00', maxEntryHour: '20:00', minExitHour: '5:30', maxExitHour: '20:30' }
    });


    useEffect(() => {


        if (!selectedTrabajador) {
            if (code) {
                dispatch(selectTrabajadorByCode(code));
                fetchExtraHours(setExtraHours, code);
            } else {
                navigate("/control-horari/trabajadores");
                return;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTrabajador])


    useEffect(() => {
        if (extraHours.length === 0) return;

        setHourLimits(prevHourLimits => {
            const newHourLimits = { ...prevHourLimits };
            // Organize extra hours by day type for efficient access
            const organizedHours: Record<DayType, ExtraHours[]> = {
                laborable: [],
                viernes: []
            };

            extraHours.forEach(eh => {
                organizedHours[eh.day_type].push(eh);
            });
            //sort organized hours by start_hour from earliest to latest and transform start_hour and end_hour to minutes temporarily
            Object.keys(organizedHours).forEach(dayTypeKey => {
                const dayType = dayTypeKey as DayType;
                organizedHours[dayType].sort((a, b) => timeToMinutes(a.start_hour) - timeToMinutes(b.start_hour));
            });

            // Now process each day type separately
            Object.keys(organizedHours).forEach(dayTypeKey => {
                const dayType = dayTypeKey as DayType;
                const dayHours = organizedHours[dayType];

                // Process entry and exit hours separately
                //const entryHours = dayHours.filter(eh => eh.is_entry).map(eh => eh.start_hour).sort(sortHours);
                //const exitHours = dayHours.filter(eh => !eh.is_entry).map(eh => eh.end_hour).sort(sortHours);

                // If there are day hours, for the first day hour and the consequent hour consequent dayhours
                const entryHours: ExtraHours[] = [];
                if (dayHours.length > 0) {
                    // Get the first day hour
                    entryHours.push(dayHours[0]);
                    // Get the consequent day hours
                    for (let i = 1; i < dayHours.length; i++) {
                        const currentHour = dayHours[i];
                        const previousHour = dayHours[i - 1];
                        // If the current hour is not the consequent hour of the previous hour, add the previous hour
                        if (timeToMinutes(currentHour.start_hour) - 30 === timeToMinutes(previousHour.start_hour)) {
                            entryHours.push(previousHour);
                        } else {
                            entryHours.push(previousHour);
                            // Exit the loop
                            break;
                        }
                    }
                }
                // Now do the opposite so it will be for the exit hours
                const exitHours: ExtraHours[] = [];
                if (dayHours.length > 0) {
                    // Get the last day hour
                    exitHours.push(dayHours[dayHours.length - 1]);
                    // Get the consequent day hours
                    for (let i = dayHours.length - 2; i >= 0; i--) {
                        const currentHour = dayHours[i];
                        const previousHour = dayHours[i + 1];
                        // If the current hour is not the consequent hour of the previous hour, add the previous hour
                        if (timeToMinutes(currentHour.start_hour) + 30 === timeToMinutes(previousHour.start_hour)) {
                            exitHours.push(previousHour);
                        } else {
                            exitHours.push(previousHour);
                            // Exit the loop
                            break;
                        }
                    }
                }


                // Update min and max entry hours
                if (dayHours.length > 0) {
                    newHourLimits[dayType].minEntryHour = entryHours[0].start_hour;
                    newHourLimits[dayType].maxEntryHour = entryHours[entryHours.length - 1].start_hour;
                    newHourLimits[dayType].minExitHour = exitHours[exitHours.length - 1].start_hour;
                    newHourLimits[dayType].maxExitHour = exitHours[0].start_hour;
                } else {
                    // If there are no entry hours, set the min and max entry hours to 5:00
                    newHourLimits[dayType].minEntryHour = '5:00'
                    newHourLimits[dayType].maxEntryHour = '5:00'
                    newHourLimits[dayType].minExitHour = '20:30'
                    newHourLimits[dayType].maxExitHour = '20:30'
                }

            });

            return newHourLimits;
        });
    }, [extraHours]); // Re-run when extraHours changes


    // Function to handle the upload
    const handleUpload = async () => {

        // For time fields, combine the time value with the existing date
        const timeEnterParts = newWorkday.enterHour.split(':');
        const newEnterDate: Date = new Date(newWorkday.date);
        newEnterDate.setHours(parseInt(timeEnterParts[0]), parseInt(timeEnterParts[1]));
        const timeExitParts = newWorkday.exitHour.split(':');
        const newExitDate: Date = new Date(newWorkday.date);
        newExitDate.setHours(parseInt(timeExitParts[0]), parseInt(timeExitParts[1]));
        const timeStartBreakfastParts = newWorkday.startBreakfastHour.split(':');
        const newStartBreakfastDate: Date = new Date(newWorkday.date);
        newStartBreakfastDate.setHours(parseInt(timeStartBreakfastParts[0]), parseInt(timeStartBreakfastParts[1]));
        const timeEndBreakfastParts = newWorkday.endBreakfastHour.split(':');
        const newEndBreakfastDate: Date = new Date(newWorkday.date);
        newEndBreakfastDate.setHours(parseInt(timeEndBreakfastParts[0]), parseInt(timeEndBreakfastParts[1]));
        const timeStartLunchParts = newWorkday.startLunchHour.split(':');
        const newStartLunchDate: Date = new Date(newWorkday.date);
        newStartLunchDate.setHours(parseInt(timeStartLunchParts[0]), parseInt(timeStartLunchParts[1]));
        const timeEndLunchParts = newWorkday.endLunchHour.split(':');
        const newEndLunchDate: Date = new Date(newWorkday.date);
        newEndLunchDate.setHours(parseInt(timeEndLunchParts[0]), parseInt(timeEndLunchParts[1]));

        const payload = {
            worker_code: selectedTrabajador?.code,
            date: newWorkday.date,
            enterHour: newEnterDate,
            exitHour: newExitDate,
            startBreakfastHour: newStartBreakfastDate,
            endBreakfastHour: newEndBreakfastDate,
            startLunchHour: newStartLunchDate,
            endLunchHour: newEndLunchDate
        };


        // Here, adapt this to your API call logic
        try {
            const response = await Api.post('/worker/work_day/add', payload);
            toast.success('Día de trabajo añadido correctamente');
            // After successful upload, fetch the updated workdays
            fetchWorkedHours(startDate, endDate);
        } catch (error) {
            // Handle your errors
            toast.error('Error al añadir día de trabajo');
        }
    };


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

    type WorkingDayField = 'date' | 'enterHour' | 'exitHour' | 'startBreakfastHour' | 'endBreakfastHour' | 'startLunchHour' | 'endLunchHour';

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
        toast.success('Hora registrada correctamente');

        const newWorkingDays = [...workingDays];
        newWorkingDays[editMode.dayIndex] = { ...day, [field]: field !== 'date' ? newDate : new Date(newDate) };
        setWorkingDays(newWorkingDays);


        // Exit edit mode
        setEditMode({ date: false, time: false, dayIndex: -1, field: '' });
    };


    useFetchWorkers();


    const fetchWorkedHours = useCallback(
        async (startDate: string | number | readonly string[] | undefined, endDate: string | number | readonly string[] | undefined) => {
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
                let exit_hour: Date | null = new Date(work_schedule.exit_hour);
                // if year is 1970, it means that the date is null
                if (exit_hour.getFullYear() === 0) {
                    exit_hour = null;
                }
                let breakfast_start_hour: Date | null = new Date(work_schedule.breakfast_start_hour);
                if (breakfast_start_hour.getFullYear() === 0) {
                    breakfast_start_hour = null;
                }
                let breakfast_end_hour: Date | null = new Date(work_schedule.breakfast_end_hour);
                if (breakfast_end_hour.getFullYear() === 0) {
                    breakfast_end_hour = null;
                }
                let lunch_start_hour: Date | null = new Date(work_schedule.lunch_start_hour);
                if (lunch_start_hour.getFullYear() === 0) {
                    lunch_start_hour = null;
                }
                let lunch_end_hour: Date | null = new Date(work_schedule.lunch_end_hour);
                if (lunch_end_hour.getFullYear() === 0) {
                    lunch_end_hour = null;
                }


                return {
                    date,
                    enterHour: entry_hour,
                    exitHour: exit_hour,
                    startBreakfastHour: breakfast_start_hour,
                    endBreakfastHour: breakfast_end_hour,
                    startLunchHour: lunch_start_hour,
                    endLunchHour: lunch_end_hour
                }
            });
            //order the days from newest to oldest
            obtainedWorkingDays.sort((a, b) => {
                const [aYear, aMonth, aDay] = b.date.toISOString().slice(0, 10).split("-");
                const [bYear, bMonth, bDay] = a.date.toISOString().slice(0, 10).split("-");
                if (aYear !== bYear) {
                    return parseInt(aYear) - parseInt(bYear);
                }
                if (aMonth !== bMonth) {
                    return parseInt(aMonth) - parseInt(bMonth);
                }
                return parseInt(aDay) - parseInt(bDay);
            });


            setWorkingDays(obtainedWorkingDays);



        }, [code]);


    useEffect(() => {
        fetchWorkedHours(startDate, endDate);
    }, [startDate, endDate, fetchWorkedHours])

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
            <PDFDownloadLink document={<ExtraWorkDaysPDF hourLimits={hourLimits} workingDays={deepCopy(workingDays) as WorkingDay[]} selectedTrabajador={selectedTrabajador} />} fileName={`${selectedTrabajador?.code}-${selectedTrabajador?.name}.pdf`}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' :
                        <button className='btn btn-primary btn m-2' style={{ position: "absolute", right: 0, width: "fit-content", backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
                            <h3 style={{ display: "inline-block", verticalAlign: "middle" }} className=" align-items-center justify-content-center text-white">Generar PDF</h3>
                        </button>
                }
            </PDFDownloadLink>
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
                    <PDFDownloadLink document={<WorkDaysPDF hourLimits={hourLimits} workingDays={deepCopy(workingDays) as WorkingDay[]} selectedTrabajador={selectedTrabajador} />} fileName={`${selectedTrabajador?.code}-${selectedTrabajador?.name}.pdf`}>
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' :
                                <button className='btn btn-primary btn-block justify-content-center align-items-center m-2' style={{ width: "fit-content" }}><h3 style={{ display: "incline-block", verticalAlign: "top" }} className=" align-items-center justify-content-center text-white">Generar PDF</h3></button>
                        }
                    </PDFDownloadLink>
                </div>
                <button className="btn btn-primary my-2" onClick={() => setShowAddDay(!showAddDay)}>Añadir día</button>
                {showAddDay && (
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Añadir Nuevo Día de Trabajo</h5>
                            <form className="row g-3">
                                <div className="col-md-3">
                                    <label htmlFor="newWorkdayDate" className="form-label">Fecha</label>
                                    <input type="date" className="form-control" id="newWorkdayDate" value={newWorkday.date} onChange={(e) => setNewWorkday({ ...newWorkday, date: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="enterHour" className="form-label">Hora Entrada</label>
                                    <input type="time" className="form-control" id="enterHour" value={newWorkday.enterHour} onChange={(e) => setNewWorkday({ ...newWorkday, enterHour: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="exitHour" className="form-label">Hora Salida</label>
                                    <input type="time" className="form-control" id="exitHour" value={newWorkday.exitHour} onChange={(e) => setNewWorkday({ ...newWorkday, exitHour: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="startBreakfastHour" className="form-label">Inicio Desayuno</label>
                                    <input type="time" className="form-control" id="startBreakfastHour" value={newWorkday.startBreakfastHour} onChange={(e) => setNewWorkday({ ...newWorkday, startBreakfastHour: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="endBreakfastHour" className="form-label">Fin Desayuno</label>
                                    <input type="time" className="form-control" id="endBreakfastHour" value={newWorkday.endBreakfastHour} onChange={(e) => setNewWorkday({ ...newWorkday, endBreakfastHour: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="startLunchHour" className="form-label">Inicio Almuerzo</label>
                                    <input type="time" className="form-control" id="startLunchHour" value={newWorkday.startLunchHour} onChange={(e) => setNewWorkday({ ...newWorkday, startLunchHour: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="endLunchHour" className="form-label">Fin Almuerzo</label>
                                    <input type="time" className="form-control" id="endLunchHour" value={newWorkday.endLunchHour} onChange={(e) => setNewWorkday({ ...newWorkday, endLunchHour: e.target.value })} />
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                    <button type="button" className="btn btn-success" onClick={handleUpload}>Subir</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <table className="table">

                    <thead>

                        <tr>
                            <th>Fecha</th>
                            <th>Hora Entrada</th>
                            <th>Hora Salida</th>
                            <th>Hora Inicio Desayuno</th>
                            <th>Hora Final Desayuno</th>
                            <th>Hora Inicio Almuerzo</th>
                            <th>Hora Final Almuerzo</th>
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
                                        day.enterHour ? format(day.enterHour, 'HH:mm') : '-'
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'exitHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'exitHour' ?
                                        <input type="time" value={format(day.exitHour, 'HH:mm')} onChange={(e) => handleSaveChange(e, day, 'exitHour')} />
                                        :
                                        day.exitHour ? format(day.exitHour, 'HH:mm') : '-'
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'startBreakfastHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'startBreakfastHour' ?
                                        <input type="time" value={day.startBreakfastHour ? format(day.startBreakfastHour, 'HH:mm') : '00:00'} onChange={(e) => handleSaveChange(e, day, 'startBreakfastHour')} />
                                        :
                                        day.startBreakfastHour ? format(day.startBreakfastHour, 'HH:mm') : '-'
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'endBreakfastHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'endBreakfastHour' ?
                                        <input type="time" value={day.endBreakfastHour ? format(day.endBreakfastHour, 'HH:mm') : '00:00'} onChange={(e) => handleSaveChange(e, day, 'endBreakfastHour')} />
                                        :
                                        day.endBreakfastHour ? format(day.endBreakfastHour, 'HH:mm') : '-'
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'startLunchHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'startLunchHour' ?
                                        <input type="time" value={day.startLunchHour ? format(day.startLunchHour, 'HH:mm') : '00:00'} onChange={(e) => handleSaveChange(e, day, 'startLunchHour')} />
                                        :
                                        day.startLunchHour ? format(day.startLunchHour, 'HH:mm') : '-'
                                    }
                                </td>
                                <td onClick={() => toggleEditMode(index, 'endLunchHour')}>
                                    {editMode.dayIndex === index && editMode.field === 'endLunchHour' ?
                                        <input type="time" value={day.endLunchHour ? format(day.endLunchHour, 'HH:mm') : '00:00'} onChange={(e) => handleSaveChange(e, day, 'endLunchHour')} />
                                        :
                                        day.endLunchHour ? format(day.endLunchHour, 'HH:mm') : '-'
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