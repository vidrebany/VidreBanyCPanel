import { Alert } from "@mui/material";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { deleteObject, getStorage, ref as storageRef } from "firebase/storage";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ServeiTecnic } from "../../types";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";


const ServeisTecnics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const db = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    const [serveisTecnicsList, setServeisTecnicsList] = useState<ServeiTecnic[]>([]);

    const serveiTecnicRef = ref(db, "/serveiTecnic/");

    var message = "";
    if (location.state) {
        message = location.state.message;
    }

    useEffect(() => {

        //select Alert element
        let alert = document.querySelector('.alert') as HTMLDivElement;
        if (alert && message !== "") {
            alert.style.visibility = "visible";

            alert.innerHTML = message;
            setTimeout(() => {
                alert.style.visibility = "hidden";
            }, 3000);
        }

    }, [message]);

    useEffect(() => {
        onValue(serveiTecnicRef, (snapshot) => {
            const data = snapshot.val();

            let serveisTecnicsListTemp: ServeiTecnic[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let serveiTecnicData: ServeiTecnic = data[key];
                    serveisTecnicsListTemp.push(serveiTecnicData);
                }
            }
            setServeisTecnicsList(serveisTecnicsListTemp);

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function deleteServeiTecnic(serveiTecnic: ServeiTecnic) {
        const serveiTecnicRef = ref(db, "/serveiTecnic/" + serveiTecnic.key);
        const albaraUrl = serveiTecnic.albaraFile;
        const documents = serveiTecnic.documents;

        //delete albara file from firebase storage
        if (albaraUrl !== '') {
            try {
                let storageRefFromDownloadURL = storageRef(storage, albaraUrl);
                deleteObject(storageRefFromDownloadURL).then(() => {
                    console.log("deleted albara")
                });
            } catch (error) {
                console.log("error deleting: " + error)
            }
        }

        //delete documents files from firebase storage
        if (documents && documents.length > 0) {
            documents.forEach((document) => {
                try {
                    let storageRefFromDownloadURL = storageRef(storage, document);
                    deleteObject(storageRefFromDownloadURL).then(() => {
                        console.log("deleted document")
                    });
                } catch (error) {
                    console.log("error deleting: " + error)
                }
            });
        }

        remove(serveiTecnicRef);

    }


    return (
        <div className="container tecnic">
            <Navbar />
            <Alert className="alert" severity="success">Èxit</Alert>
            <h3>Administració servei tècnic</h3>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/tecnicslist")}>Llistat professionals tècnics</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/addserveitecnic", { state: { btnTitle: 'Crear servei tècnic', alertMessage: 'Servei tècnic afegit correctament.' } })}>Afegir servei tècnic</button>
            {/*List all serveis tecnics list in a card-like manner*/}
            <div className="col">
                {serveisTecnicsList.map((serveiTecnic) => {
                    return (
                        <div className="card m-2" key={serveiTecnic.key}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{serveiTecnic.codeDistributor}</h5>
                                    <h5 className="card-title">{serveiTecnic.tecnicName}</h5>

                                </div>
                                <p className="card-text">{serveiTecnic.description}</p>
                                <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/viewserveitecnic", { state: { serveiTecnic: serveiTecnic } })}>Veure</button>
                                <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/addserveitecnic", { state: { serveiTecnic: serveiTecnic, btnTitle: 'Editar servei tècnic', alertMessage: 'Servei tècnic actualitzat correctament.' } })}>Editar</button>
                                <button type="button" className="btn btn-primary" onClick={() => deleteServeiTecnic(serveiTecnic)}>Eliminar</button>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

export default ServeisTecnics;