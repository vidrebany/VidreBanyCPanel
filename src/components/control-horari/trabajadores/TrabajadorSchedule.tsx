import { useDispatch, useSelector } from "react-redux";
import useFetchWorkers from "../../../hooks/useFetchTrabajadores";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { selectTrabajadorByCode } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import HourRange from "./HourRange";
import { Api } from "../../../api/api";
import { toast } from "react-toastify";
import { DayType, ExtraHours } from "./types/trabajadoresTypes";
import { fetchExtraHours } from "./fetchExtraHours";

const TrabajadorSchedule = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const workers = useSelector((state: RootState) => state.trabajadores.trabajadores);
    const [isEntry, setIsEntry] = useState<boolean>(true);

    useFetchWorkers();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");





    const [extraHours, setExtraHours] = useState<ExtraHours[]>([]);
    const [hourLimits, setHourLimits] = useState<Record<DayType, { minEntryHour: string, maxEntryHour: string, minExitHour: string, maxExitHour: string }>>({
        laborable: { minEntryHour: '5:00', maxEntryHour: '5:00', minExitHour: '20:30', maxExitHour: '20:30' },
        viernes: { minEntryHour: '5:00', maxEntryHour: '20:00', minExitHour: '5:30', maxExitHour: '20:30' }
    });

    const hourRanges = [
        '4:30-5:00',
        '5:00-5:30', '5:30-6:00', '6:00-6:30', // Add all hour ranges here...
        '6:30-7:00', '7:00-7:30', '7:30-8:00',
        '8:00-8:30', '8:30-9:00', '9:00-9:30',
        '9:30-10:00', '10:00-10:30', '10:30-11:00',
        '11:00-11:30', '11:30-12:00', '12:00-12:30',
        '12:30-13:00', '13:00-13:30', '13:30-14:00',
        '14:00-14:30', '14:30-15:00', '15:00-15:30',
        '15:30-16:00', '16:00-16:30', '16:30-17:00',
        '17:00-17:30', '17:30-18:00', '18:00-18:30',
        '18:30-19:00', '19:00-19:30', '19:30-20:00',
    ];

    // Utility functions to manage time conversions
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    useEffect(() => {
        // Define a function that sorts hours in ascending order
        const sortHours = (a: string, b: string) => timeToMinutes(a) - timeToMinutes(b);

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

            // Now process each day type separately
            Object.keys(organizedHours).forEach(dayTypeKey => {
                const dayType = dayTypeKey as DayType;
                const dayHours = organizedHours[dayType];

                // Process entry and exit hours separately
                const entryHours = dayHours.filter(eh => eh.is_entry).map(eh => eh.start_hour).sort(sortHours);
                const exitHours = dayHours.filter(eh => !eh.is_entry).map(eh => eh.end_hour).sort(sortHours);

                // Update min and max entry hours
                if (entryHours.length > 0) {
                    newHourLimits[dayType].minEntryHour = entryHours[0];
                    newHourLimits[dayType].maxEntryHour = entryHours[entryHours.length - 1];
                } else {
                    // If there are no entry hours, set the min and max entry hours to 5:00
                    newHourLimits[dayType].minEntryHour = '5:00'
                    newHourLimits[dayType].maxEntryHour = '5:00'
                }
                // Update min and max exit hours
                if (exitHours.length > 0) {
                    newHourLimits[dayType].minExitHour = exitHours[0];
                    newHourLimits[dayType].maxExitHour = exitHours[exitHours.length - 1];
                } else {
                    // If there are no exit hours, set the min and max exit hours to 20:30
                    newHourLimits[dayType].minExitHour = '20:30'
                    newHourLimits[dayType].maxExitHour = '20:30'
                }
            });
            console.log(newHourLimits)

            return newHourLimits;
        });
    }, [extraHours]); // Re-run when extraHours changes


    const handleExtraHoursChange = async (
        dayType: DayType,
        hourRange: string,
        isChecked: boolean,
    ) => {


        try {
            const [start_hour, end_hour] = hourRange.split("-");

            // Convert 24hr time string to a comparable format (like minutes since midnight)
            const startMinutes = timeToMinutes(start_hour);
            const endMinutes = timeToMinutes(end_hour);


            if (isChecked) {
                const limits = hourLimits[dayType];
                console.log(dayType)
                console.log("endhour:", end_hour)
                console.log("minentryhour:", limits.minEntryHour)
                const minEntryMinutes = timeToMinutes(limits.minEntryHour);
                const maxEntryMinutes = timeToMinutes(limits.maxEntryHour);
                const minExitMinutes = timeToMinutes(limits.minExitHour);
                const maxExitMinutes = timeToMinutes(limits.maxExitHour);
                if (isEntry) {
                    if (startMinutes >= maxExitMinutes || endMinutes >= minExitMinutes) {
                        toast.error("La hora de entrada no puede ser después de la hora de salida más tardía.");
                        return;
                    }
                } else {
                    console.log("endMinutes:", endMinutes)
                    console.log("maxEntryHour:", limits.maxEntryHour)
                    console.log("maxEntryMinutes:", maxEntryMinutes)
                    console.log("startMinutes:", startMinutes)
                    console.log("minEntryHour:", limits.minEntryHour)
                    console.log("minEntryMinutes:", minEntryMinutes)
                    if (endMinutes <= minEntryMinutes || startMinutes <= maxEntryMinutes) {
                        toast.error("La hora de salida no puede ser antes de la hora de entrada más temprana.");
                        return;
                    }
                }
            }

            const payload = {
                code: selectedTrabajador?.code,
                day_type: dayType,
                start_hour,
                end_hour,
                enabled: isChecked,
                is_entry: isEntry
            };

            const res = await Api.post("/worker/extra_hours/toggle", payload);

            // Update state to reflect the change
            setExtraHours(prevExtraHours => {
                // If the checkbox is checked, add the hour range to the state
                if (isChecked) {
                    return [...prevExtraHours, {
                        day_type: dayType,
                        start_hour,
                        end_hour,
                        is_entry: isEntry
                    }]
                } else {
                    // If the checkbox is not checked, remove the hour range from the state
                    return prevExtraHours.filter(eh => !(eh.day_type === dayType && eh.start_hour === start_hour && eh.end_hour === end_hour));
                }
            });

            toast.success(`Horas extras ${isChecked ? 'agregadas' : 'removidas'} con éxito.`);



        } catch (error) {
            toast.error("Error al modificar horario:" + error);
        }
    }


    useEffect(() => {

        fetchExtraHours(setExtraHours, code);

        if (!selectedTrabajador) {
            if (code) {
                dispatch(selectTrabajadorByCode(code));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, dispatch, selectedTrabajador, workers])



    if (!selectedTrabajador) {
        return <div>
            <button className="btn btn-primary align-items-start" onClick={() => navigate(`/control-horari/trabajadores/trabajador-details?code=${code}`)}>Volver</button>
            Ningún trabajador seleccionado
        </div>;
    }

    return (
        <div>
            <button className="btn btn-primary align-items-start" onClick={() => navigate(`/control-horari/trabajadores/trabajador-details?code=${code}`)}>Volver</button>
            <div className="d-flex flex-column">
                <h1>Gestión horario</h1>
                <h2 className="ms-4 mb-4">Detalles trabajador</h2>
                <h3>Trabajador Seleccionado:</h3>
                <h3>{selectedTrabajador.name}</h3>
            </div>
            <div>
                <button
                    className={`btn ${isEntry === true ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setIsEntry(true)}>Horas extra</button>
                {/*<button
                    className={`btn ${isEntry === false ? "btn-danger" : "btn-outline-danger"}`}
    onClick={() => setIsEntry(false)}>Salida</button>*/}
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Horas extras no oficiales</th>
                        {hourRanges.map((range, index) => (
                            <th key={index}>{range}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <HourRange label="laborable" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "laborable")}
                        onChange={handleExtraHoursChange} />
                    <HourRange label="viernes" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "viernes")}
                        onChange={handleExtraHoursChange} />
                        {/*
                    <HourRange label="sabado" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "sabado")}
                        onChange={handleExtraHoursChange} />
                    <HourRange label="domingo_festivo" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "domingo_festivo")}
                        onChange={handleExtraHoursChange} />
                        */}
                </tbody>
            </table>
        </div>
    )
}

export default TrabajadorSchedule;


