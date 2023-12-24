import { useDispatch, useSelector } from "react-redux";
import useFetchWorkers from "../../../hooks/useFetchTrabajadores";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { selectTrabajadorByCode } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import HourRange from "./HourRange";
import { Api } from "../../../api/api";
import { toast } from "react-toastify";

type DayType = "laborable" | "sabado" | "domingo_festivo";

type ExtraHours = {
    day_type: DayType,
    start_hour: string,
    end_hour: string,
}

const TrabajadorSchedule = () => {
    const selectedTrabajador = useSelector((state: RootState) => state.trabajadores.selectedTrabajador);
    const workers = useSelector((state: RootState) => state.trabajadores.trabajadores);

    useFetchWorkers();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    const [extraHours, setExtraHours] = useState<ExtraHours[]>([]);

    const fetchExtraHours = async () => {
        const res = await Api.get(`/worker/extra_hours/${code}`).catch((err) => {
            const error = (err.response.data.error);
            toast.error("Error al obtener horario:", error);
            return;
        });

        if (!res) return;

        setExtraHours(res.data);

    }

    useEffect(() => {

        fetchExtraHours();

        if (!selectedTrabajador) {
            if (code) {
                dispatch(selectTrabajadorByCode(code));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, dispatch, selectedTrabajador, workers])

    const hourRanges = [
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

    const handleExtraHoursChange = async (
        dayType: DayType,
        hourRage: string,
        isChecked: boolean
    ) => {
        try {
            const [start_hour, end_hour] = hourRage.split("-");
            const payload = {
                code: selectedTrabajador?.code,
                day_type: dayType,
                start_hour,
                end_hour,
                enabled: isChecked,
            };

            const res = await Api.post("/worker/extra_hours/toggle", payload);
            console.log(res)

            // Update state to reflect the change
            setExtraHours(prevExtraHours => {
                // If the checkbox is checked, add the hour range to the state
                if (isChecked) {
                    return [...prevExtraHours, {
                        day_type: dayType,
                        start_hour,
                        end_hour
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
                    <HourRange label="sabado" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "sabado")}
                        onChange={handleExtraHoursChange} />
                    <HourRange label="domingo_festivo" ranges={hourRanges}
                        extraHours={extraHours.filter(eh => eh.day_type === "domingo_festivo")}
                        onChange={handleExtraHoursChange} />
                </tbody>
            </table>
        </div>
    )
}

export default TrabajadorSchedule;


