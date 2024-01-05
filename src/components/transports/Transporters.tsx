import { useEffect, useState } from "react";
import { TransportersData } from "../../types";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./styles/Transporters.css"
import Alert from "@mui/material/Alert";


const Transporters = () => {
    const navigate = useNavigate();

    //firebase database
    const db = getDatabase(firebaseApp);
    //transport ref
    const transportRef = ref(db, "/transporters/");
    const mailRef = ref(db, "/mails/destination");

    //transport list useState that has a list of Transports[] objects
    const [transportList, setTransportList] = useState<TransportersData[]>([]);
    const [transName, setTransName] = useState('');

    const [emailDesti, setEmailDesti] = useState("");

    //get transport list
    useEffect(() => {
        onValue(transportRef, (snapshot) => {
            const data = snapshot.val();

            let transportListTemp: TransportersData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let transportOrder: TransportersData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    transportListTemp.push(transportOrder);
                }
            }



            setTransportList(transportListTemp);




        });
    }, []);

    useEffect(() => {
        onValue(mailRef, (snapshot) => {
            const data = snapshot.val();
            setEmailDesti(data.mail);
        });
    }, [emailDesti]);


    function setDestinationMail() {
        const dbRef = ref(db, '/mails/destination');
        set(dbRef, {
            mail: emailDesti,
        });
    }

    function showFields(): void {
        const textField = document.querySelectorAll(".textField") as NodeListOf<HTMLElement>;
        const addButton = document.getElementById("addButton") as HTMLElement;
        if (textField) {
            for (let i = 0; i < textField.length; i++) {
                if (textField[i].style.visibility === "collapse") {
                    textField[i].style.visibility = "visible";
                    textField[i].style.height = "auto";
                } else {
                    textField[i].style.visibility = "collapse";
                    textField[i].style.height = "0px";
                }
            }
        }
    }

    function addNewTrans(): void {
        showFields();
        //push new transName to firebase, the pushed content will be the transName and the generated id
        const dbRef = ref(db, '/transporters/');

        const newTransportRef = push(dbRef);
        //get key from newTransportRef
        const key = newTransportRef.key;

        set(newTransportRef, {
            id: key,
            name: transName,
        });
        //select Alert element
        let alert = document.querySelector('.alert') as HTMLDivElement;
        if (alert) {
            alert.style.visibility = "visible";
            setTimeout(() => {
                alert.style.visibility = "hidden";
            }, 3000);
        }
    }

    function deleteTrans(id: string): void {
        const dbRef = ref(db, '/transporters/' + id);
        remove(dbRef);
    }

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <Alert className="alert" severity="success">Èxit</Alert>
            <div>
                <h1 style={{ textAlign: 'center' }}>Transports</h1>
            </div>


            <h3>Llista transportistes</h3>
            <Stack spacing={2} direction="column">
                <Button id="addButton" onClick={() => showFields()} variant="contained">Afegir transportista</Button>

                <div className="d-flex">
                    <input
                    className="m-1"
                        type="text"
                        id="location"
                        value={emailDesti}
                        placeholder="Destí on enviar factures"
                        onChange={(e) => setEmailDesti(e.target.value)}
                    />
                    <Button className="m-1" id="addButton" onClick={() => setDestinationMail()} variant="contained">Canviar Mail</Button>
                </div>

                <Button onClick={() => navigate('/transport')} variant="contained">Tornar</Button>
                <TextField className="textField" style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Nom trans."
                    rows={4}
                    value={transName}
                    variant="outlined"
                    onChange={(e) => setTransName(e.target.value)}
                />
                <Button className="textField" onClick={() => addNewTrans()} variant="contained">Afegir nou</Button>

            </Stack>
            <div className="listView">

                {/*Map transportList*/}
                {transportList.map((transport) => {


                    return (
                        <div className="transportCard" key={transport.id}>
                            <p>{transport.name}</p>
                            <img
                                style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                onClick={() => deleteTrans(transport.id)}
                                src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                alt={"trashcan"}></img>
                        </div>
                    );
                })}


            </div>

        </div >
    );
};

export default Transporters;