import { Alert } from "@mui/material";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
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
        setTecnicName('');

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
    }, []);

    function deleteTecnic(id: string): void {
        const dbRef = ref(db, '/tecnics/' + id);
        remove(dbRef);
    }


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
            <div className="col">
                {tecnicsList.map((tecnic) => {
                    return (
                        <div className="row m-2" key={tecnic.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <h5 className="card-title">{tecnic.name}</h5>
                                    </div>
                                    <div className="d-flex flex-row align-items-center justify-content-center">
                                        <button type="button" className="btn btn-secondary">Veure serveis</button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteTecnic(tecnic.id)}>Eliminar</button>
                                    </div>
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