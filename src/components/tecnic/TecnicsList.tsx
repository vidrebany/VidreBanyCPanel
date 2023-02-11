import { Alert } from "@mui/material";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../firebase";
import { TecnicData } from "../../types";


const TecnicsList = () => {

    const navigate = useNavigate();
    const db = getDatabase(firebaseApp);
    const tecnicsRef = ref(db, '/tecnics/');

    const [tecnicName, setTecnicName] = useState('');
    const [tecnicsList, setTecnicsList] = useState<TecnicData[]>([]);


    function showAddTecnic(): void {
        const addTecnic = document.querySelector(".addTecnic");
        if (addTecnic) {
            addTecnic.classList.toggle("h-auto");
            addTecnic.classList.toggle("collapse");
        } else {
            console.log("No s'ha trobat el div addTecnic");
        }
    }

    function addNewTecnic(): void {
        showAddTecnic();

        const newTecnicRef = push(tecnicsRef);
        const key = newTecnicRef.key;

        set(newTecnicRef, {
            id: key,
            name: tecnicName,
        });

        //select Alert element
        let alertMui = document.querySelector('.alert') as HTMLDivElement;
        if (alertMui) {
            alertMui.style.visibility = "visible";
            setTimeout(() => {
                alertMui.style.visibility = "hidden";
            }, 3000);
        }
    }


    //get tecnics list
    useEffect(() => {
        onValue(tecnicsRef, (snapshot) => {
            const data = snapshot.val();

            let tecnicsListTemp: TecnicData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let tecnicData: TecnicData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    tecnicsListTemp.push(tecnicData);
                }
            }



            setTecnicsList(tecnicsListTemp);




        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tecnicsList]);

    return (
        <div className="container">
            <h1>Llistat professionals tècnics</h1>
            <Alert className="alert" severity="success">Èxit</Alert>
            <div className="w-100 d-flex justify-content-start">
                <button type="button" className="btn btn-primary" onClick={() => navigate('/tecnic')}>Tornar</button>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => showAddTecnic()}>Afegir tècnic</button>
            <div className="addTecnic h-0 collapse">
                <div className="d-flex flex-column">
                    <input value={tecnicName} onChange={(e) => setTecnicName(e.target.value)} type="text" className="form-control tecnicName text-center" placeholder="Nom tècnic a afegir" aria-label="Nom" aria-describedby="basic-addon1" />
                    <button type="button" className="btn btn-primary" onClick={() => addNewTecnic()}>Afegir nou</button>
                </div>
            </div>
            {/*List all tecnics in a card-like manner*/}
            <div className="row">
                {tecnicsList.map((tecnic) => {
                    return (
                        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{tecnic.name}</h5>
                                    <button type="button" className="btn btn-primary">Editar</button>
                                    <button type="button" className="btn btn-danger">Eliminar</button>
                                    <button type="button" className="btn btn-success">Veure serveis</button>
                                    <button type="button" className="btn btn-warning">Afegir servei</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}

export default TecnicsList;