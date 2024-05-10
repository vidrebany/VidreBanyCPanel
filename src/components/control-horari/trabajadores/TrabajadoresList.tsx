import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Trabajador } from "./types/trabajadoresTypes";
import { modifyTrabajador, removeTrabajador, setSelectedTrabajador } from "../../../redux/features/trabajadores/trabajadoresSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set } from 'firebase/database'; // Importa los módulos de Firebase Database

const TrabajadoresList = () => {
    const db = getDatabase(); // Obtiene la instancia de la base de datos de Firebase
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
    const [editingTrabajador, setEditingTrabajador] = useState<Trabajador | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const [editedCode, setEditedCode] = useState<string>("");

    const [trabajadorToRemove, setTrabajadorToRemove] = useState<Trabajador | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    useEffect(() => {
        const usersRef = ref(db, "users"); // Cambiando la referencia a la colección "users"
        const handleData = (snapshot: any) => { // Cambia any por el tipo correcto si es posible
            const data = snapshot.val();
            if (data) {
                const trabajadoresArray: Trabajador[] = Object.values(data);
                setTrabajadores(trabajadoresArray);
            }
        };

        // Solo carga los trabajadores una vez al cargar la página inicialmente
        onValue(usersRef, handleData);

        return () => { 
            // No es necesario detener la escucha aquí ya que queremos que los trabajadores se actualicen cuando cambien
        };
    }, []); // El arreglo vacío asegura que se ejecute solo una vez al cargar la página inicialmente

    const handleSelectForModification = (trabajador: Trabajador) => {
        setEditingTrabajador(trabajador);
        setEditedName(trabajador.name);
        setEditedCode(trabajador.code);
    };

    const modifyTrabajadorHandler = async () => {
        if (editingTrabajador) {
            if (editedName === "" || editedCode === "") return toast.error("Debes rellenar todos los campos");
            const trabajadorModified: Trabajador = {
                name: editedName,
                code: editingTrabajador.code
            };
            try {
                await set(ref(db, `users/${editingTrabajador.code}`), trabajadorModified); // Actualiza los datos en Firebase
                dispatch(modifyTrabajador(trabajadorModified));
                setEditingTrabajador(null);
                toast.success("Trabajador modificado correctamente");
            } catch (error) {
                console.error("Error al modificar trabajador:", error);
                toast.error("Error al modificar trabajador");
            }
        }
    };

    const removeTrabajadorHandler = (trabajador: Trabajador) => {
        setTrabajadorToRemove(trabajador);
        setShowConfirmationModal(true);
    };

    const confirmRemoveTrabajador = async () => {
        if (trabajadorToRemove) {
            try {
                await set(ref(db, `users/${trabajadorToRemove.code}`), null); // Elimina el trabajador de Firebase
                dispatch(removeTrabajador(trabajadorToRemove.code));
                toast.success("Trabajador eliminado correctamente");
    
                // Actualizar el estado local después de la eliminación exitosa
                setTrabajadores(trabajadores.filter(trabajador => trabajador.code !== trabajadorToRemove.code));
            } catch (error) {
                console.error("Error al eliminar trabajador:", error);
                toast.error("Error al eliminar trabajador");
            }
        }
        setShowConfirmationModal(false);
        setTrabajadorToRemove(null);
    };

    const handleSelect = (trabajador: Trabajador) => {
        dispatch(setSelectedTrabajador(trabajador));
        navigate(`trabajador-details?code=${trabajador.code}`);
    };

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
                    {trabajadores.map((trabajador, index) => (
                        <tr key={index}>
                            <td>
                                {editingTrabajador?.code === trabajador.code ? (
                                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="form-control" />
                                ) : (
                                    trabajador.name
                                )}
                            </td>
                            <td>{trabajador.code}</td>
                            <td className="text-end">
                                <button className="btn btn-info" onClick={() => handleSelect(trabajador)}>Seleccionar</button>
                                {editingTrabajador?.code === trabajador.code ? (
                                    <button className="btn btn-success" onClick={modifyTrabajadorHandler}>Guardar</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleSelectForModification(trabajador)}>Modificar</button>
                                )}
                                <button className="btn btn-danger" onClick={() => removeTrabajadorHandler(trabajador)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
            {showConfirmationModal && <div className="modal-backdrop show"></div>}
        </div>
    );
};

export default TrabajadoresList;