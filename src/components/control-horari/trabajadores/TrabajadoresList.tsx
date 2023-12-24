import { useDispatch } from "react-redux";
import { Trabajador } from "./types/trabajadoresTypes";
import { modifyTrabajador, removeTrabajador, setSelectedTrabajador } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../../api/api";


/*
type Trabajador = {
    name: string,
    code: string,
}
*/

const TrabajadoresList = ({ trabajadores }: { trabajadores: Trabajador[] }) => {

    const dispatch = useDispatch();



    const [editingTrabajador, setEditingTrabajador] = useState<Trabajador | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [editedCode, setEditedCode] = useState<string>("");

    const [trabajadorToRemove, setTrabajadorToRemove] = useState<Trabajador | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const handleSelectForModification = (trabajador: Trabajador) => {
        setEditingTrabajador(trabajador);
        setEditedName(trabajador.name);
        setEditedCode(trabajador.code);
    }
    const modifyTrabajadorHandler = async () => {
        if (editingTrabajador) {
            if (editedName === "" || editedCode === "") return toast.error("Debes rellenar todos los campos");
            const trabajadorModified: Trabajador = {
                name: editedName,
                code: editingTrabajador.code
            }
            const res = await Api.post("/worker/update", trabajadorModified).catch((err) => {
                const error = (err.response.data.error);
                if (error.includes("duplicate")) {
                    toast.error("Ya existe o existió un trabajador con ese código");
                    return;
                }
                toast.error("Error al modificar trabajador:", error);
                return;
            });

            if (!res) return;

            dispatch(modifyTrabajador(res.data.worker));
            setEditingTrabajador(null);
            toast.success("Trabajador modificado correctamente");
        }
    }

    const removeTrabajadorHandler = async (trabajador: Trabajador) => {


        setTrabajadorToRemove(trabajador);
        setShowConfirmationModal(true);
    }

    const confirmRemoveTrabajador = async () => {
        if (trabajadorToRemove) {
            //ad trabajador code as query param
            const res = await Api.delete(`/worker/delete?code=${trabajadorToRemove.code}`).catch((err) => {
                const error = (err.response.data.error);
                toast.error("Error al eliminar trabajador:", error);
                return;
            });
            if (!res) return;
            dispatch(removeTrabajador(trabajadorToRemove.code));
            toast.success("Trabajador eliminado correctamente");
        }
        setShowConfirmationModal(false);
        setTrabajadorToRemove(null);
    };
    const navigate = useNavigate();

    const handleSelect = (trabajador: Trabajador) => {
        dispatch(setSelectedTrabajador(trabajador));
        navigate("trabajador-details?code=" + trabajador.code);
    }

    return (
        <div className="w-100">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trabajadores.map((trabajador, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    {editingTrabajador?.code === trabajador.code ? (
                                        <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="form-control" />
                                    ) : (
                                        trabajador.name
                                    )}
                                </td>
                                <td>
                                    {trabajador.code}
                                </td>
                                <td className="text-end">
                                    <button className="btn btn-info" onClick={() => handleSelect(trabajador)}>Seleccionar</button>
                                    {editingTrabajador?.code === trabajador.code ? (
                                        <button className="btn btn-success" onClick={modifyTrabajadorHandler}>Guardar</button>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => handleSelectForModification(trabajador)}>Modificar</button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => removeTrabajadorHandler(trabajador)}>Eliminar</button>
                                    {showConfirmationModal && (
                                        <div className="modal show" style={{ display: "block" }} tabIndex={-1}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Confirmar eliminación</h5>
                                                        <button type="button" className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
                                                    </div>
                                                    <div className="modal-body text-center">
                                                        <p>¿Estás seguro de que quieres eliminar a {trabajadorToRemove?.name}?</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmationModal(false)}>Cancelar</button>
                                                        <button type="button" className="btn btn-danger" onClick={confirmRemoveTrabajador}>Eliminar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Overlay for the modal */}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {showConfirmationModal && <div className="modal-backdrop show"></div>}
        </div>
    )
}

export default TrabajadoresList;