import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Trabajador, WorkingDay } from './types/trabajadoresTypes';
import { selectTrabajadorByCode } from '../../../redux/features/trabajadores/trabajadoresSlice';
import useFetchWorkers from '../../../hooks/useFetchTrabajadores';
import { Api } from '../../../api/api';
import { toast } from 'react-toastify';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';


// Create PDF styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 10
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    table: {
        display: "flex",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "12.5%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    }
});

const calculateWorkedHours = (day: WorkingDay) => {
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


// Document Component
const WorkDaysPDF = ({ workingDays, selectedTrabajador }: { workingDays: WorkingDay[], selectedTrabajador: Trabajador }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Control Horarios VidreBany - {selectedTrabajador.name} ({selectedTrabajador.code})</Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Fecha</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Hora</Text><Text style={styles.tableCell}>Entrada</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Hora</Text><Text style={styles.tableCell}>Salida</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Inicio</Text><Text style={styles.tableCell}>Desayuno</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Fin</Text><Text style={styles.tableCell}>Desayuno</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Inicio</Text><Text style={styles.tableCell}>Almuerzo</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Fin</Text><Text style={styles.tableCell}>Almuerzo</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Horas</Text><Text style={styles.tableCell}>Trabajadas</Text></View>
                </View>
                {/* Table Rows */}
                {workingDays.map((day: WorkingDay, index: number) => (
                    <View key={index} style={styles.tableRow}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.date ? format(day.date, "dd/MM/yyyy") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.enterHour ? format(day.enterHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.exitHour ? format(day.exitHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.startBreakfastHour ? format(day.startBreakfastHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.endBreakfastHour ? format(day.endBreakfastHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.startLunchHour ? format(day.startLunchHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{day.endLunchHour ? format(day.endLunchHour, "HH:mm") : '-'}</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>{calculateWorkedHours(day)}</Text></View>
                    </View>
                ))}
            </View>
            {/* Footer */}
            <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, width: "80%" }}><Text style={styles.tableCell}>Sumatorio Horas Trabajadas</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{workingDays.reduce((acc, day) => acc + parseFloat(calculateWorkedHours(day)), 0).toFixed(2)}</Text></View>
            </View>
        </Page>
    </Document>
);


const TrabajadorDetails = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const workers = useSelector((state: RootState) => state.trabajadores.trabajadores);
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

        console.log(payload);

        // Here, adapt this to your API call logic
        try {
            const response = await Api.post('/worker/work_day/add', payload);
            console.log(response.data);
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
            console.log(obtainedWorkingDays)

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
                    <PDFDownloadLink document={<WorkDaysPDF workingDays={workingDays} selectedTrabajador={selectedTrabajador} />} fileName={`${selectedTrabajador?.code}-${selectedTrabajador?.name}.pdf`}>
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
                                        day.startBreakfastHour? format(day.startBreakfastHour, 'HH:mm') : '-'
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