import { Alert } from "@mui/material";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { deleteObject, getStorage, ref as storageRef } from "firebase/storage";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ServeiTecnic } from "../../types";
import firebaseApp from "../../firebase";


const ServeisTecnics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const db = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    const [serveisTecnicsList, setServeisTecnicsList] = useState<ServeiTecnic[]>([]);

    const serveiTecnicRef = ref(db, "/serveiTecnic/");

    const [isPendent, setIsPendent] = useState(true);
    const [isPerRevisar, setIsPerRevisar] = useState(false);
    const [isFinalitzat, setIsFinalitzat] = useState(false);
    const [isMesura, setIsMesura] = useState(true);
    const [isInstalacio, setIsInstalacio] = useState(false);

    var message = "";
    if (location.state) {
        message = location.state.message;
    }

    const handleCheckbox = (e: string) => {
        //only one of the checkboxes can be checked at a time
        if (e === "isPendent") {
            setIsPendent(!isPendent);
            setIsPerRevisar(false);
            setIsFinalitzat(false);
        } else if (e === "isPerRevisar") {
            setIsPendent(false);
            setIsPerRevisar(!isPerRevisar);
            setIsFinalitzat(false);
        } else if (e === "isFinalitzat") {
            setIsPendent(false);
            setIsPerRevisar(false);
            setIsFinalitzat(!isFinalitzat);
        }
    }

    const handleTypeCheckbox = (e: string) => {
        //make only one of the checkboxes can be checked at a time, if the same checkbox is checked twice, it will be unchecked
        if (e === "isMesura") {
            setIsMesura(!isMesura);
            setIsInstalacio(false);
        } else if (e === "isInstalacio") {
            setIsMesura(false);
            setIsInstalacio(!isInstalacio);
        } else if (e !== "isMesura" && e === "isInstalacio") {
            setIsMesura(false);
            setIsInstalacio(true);
        } else if (e !== "isMesura" && e !== "isInstalacio") {
            setIsMesura(true);
            setIsInstalacio(true);
        } else {
            setIsMesura(true);
            setIsInstalacio(true);
        }
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

                    if (filterTypeServei(serveiTecnicData) && filterStateServei(serveiTecnicData)) {
                        serveisTecnicsListTemp.push(serveiTecnicData);
                    }


                }
            }
            setServeisTecnicsList(serveisTecnicsListTemp);

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPendent, isPerRevisar, isFinalitzat, isMesura, isInstalacio]);

    function filterStateServei(serveiTecnicData: ServeiTecnic) {
        if ((isPendent && !isPerRevisar && !isFinalitzat) || (!isPendent && isPerRevisar && !isFinalitzat) || (!isPendent && !isPerRevisar && isFinalitzat)) {
            if (isPendent && serveiTecnicData.stateServei === "Pendent") {
                return true;
            } else if (isPerRevisar && serveiTecnicData.stateServei === "Per revisar") {
                return true;
            } else if (isFinalitzat && serveiTecnicData.stateServei === "Finalitzat") {
                return true;
            }
        } else {
            return true;
        }
        return false;
    }

    function filterTypeServei(serveiTecnicData: ServeiTecnic) {

        if (isMesura && serveiTecnicData.isMesura === true) {
            return true;
        } else if (!isMesura && serveiTecnicData.isMesura === false) {
            return true;
        }


        return false;
    }

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
            <Alert className="alert" severity="success">Èxit</Alert>
            <h3>Administració servei tècnic</h3>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/tecnicslist")}>Llistat professionals tècnics</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/addserveitecnic", { state: { btnTitle: 'Crear servei tècnic', alertMessage: 'Servei tècnic afegit correctament.' } })}>Afegir servei tècnic</button>
            <div className="form-group form-check w-auto m-2 d-flex justify-space-between">
                <input checked={isPendent} value="isPendent" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="form-check-input mx-2" id="installation" />
                <label className="form-check-label" htmlFor="installation">Pendents</label>
                <input checked={isPerRevisar} value="isPerRevisar" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                <label className="form-check-label" htmlFor="measureTaking">Per revisar</label>
                <input checked={isFinalitzat} value="isFinalitzat" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                <label className="form-check-label" htmlFor="measureTaking">Finalitzats</label>
            </div>
            <div className="form-group form-check w-auto m-2 d-flex justify-space-between">
                <input checked={isMesura} value="isMesura" onChange={(e) => handleTypeCheckbox(e.target.value)} type="checkbox" className="form-check-input mx-2" id="installation" />
                <label className="form-check-label" htmlFor="installation">Presa mesures</label>
                <input checked={isInstalacio} value="isInstalacio" onChange={(e) => handleTypeCheckbox(e.target.value)} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                <label className="form-check-label" htmlFor="measureTaking">Instal·lació</label>
            </div>
            {/*List all serveis tecnics list in a card-like manner*/}
            <div className="col">
                {serveisTecnicsList.map((serveiTecnic) => {
                    return (
                        <div className="card m-2" key={serveiTecnic.key}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="card-title">{serveiTecnic.stateServei}</p>
                                    <p className="card-title">{serveiTecnic.isMesura ? 'Mesura' : 'Instal·lació'}</p>
                                </div>
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
