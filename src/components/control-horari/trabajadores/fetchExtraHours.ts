import { Api } from "../../../api/api";
import { ExtraHours } from "./types/trabajadoresTypes";
import { toast } from "react-toastify";


export const fetchExtraHours = async (setExtraHours: (extraHours: ExtraHours[]) => void, code: string | null) => {
    const res = await Api.get(`/worker/extra_hours/${code}`).catch((err) => {
        const error = (err.response.data.error);
        toast.error("Error al obtener horario:", error);
        return;
    });

    if (!res) return;

    setExtraHours(res.data);

}