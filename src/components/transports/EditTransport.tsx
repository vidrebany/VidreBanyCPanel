import { Transports } from "../../types";
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Alert from '@mui/material/Alert';
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { TransportersData } from "../../types";
import firebaseApp from "../../firebase";
import { Checkbox, FormControlLabel } from '@mui/material';



export default function EditTransport() {


    const location = useLocation();
    const navigate = useNavigate();



    const transport: Transports = location.state.transport;



    const db = getDatabase(firebaseApp);
    const [transportista, setTransportista] = useState('');
    const [transList, setTransList] = useState<TransportersData[]>([]);
    const [transportsPending, setTransportsPending] = useState<boolean>(false);

    const handleSelectChange = (event: SelectChangeEvent) => {
        setTransportista(event.target.value as string);
    };

    const handleTransportsPendingChange = () => {
        if (transportsPending) {
            setTransportsPending(false);
        } else {
            setTransportsPending(true);
        }
    };

    var mounted = false;

    //get transport list
    useEffect(() => {
        const transportRef = ref(db, "/transporters/");

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



            if (!mounted) {
                setTransList(transportListTemp);

            }


            // eslint-disable-next-line react-hooks/exhaustive-deps
            mounted = true;
        });

        setTransportista(transport.transId);
        setAddressTxt(transport.address);
        setAlbaraNum(transport.albaraNum);
        setClientNum(transport.clientNum);
        setFirstTel(transport.firstTel);
        setSecondTel(transport.secondTel);
        setObservations(transport.observations);
        setTransportsPending(transport.status === "pendiente" ? true : false);
    }, []);



    const [addressTxt, setAddressTxt] = useState('');
    const [albaraNum, setAlbaraNum] = useState('');
    const [clientNum, setClientNum] = useState('');
    const [firstTel, setFirstTel] = useState('');
    const [secondTel, setSecondTel] = useState('');
    const [error, setError] = useState('');
    const [observations, setObservations] = useState('');


    useEffect(() => {
        if (error) {
            console.log(error);
        }

    }, [error])




    function uploadTransport(): void {
        //get realtime database ref and push

        try {
            //update transport inside transport/transport.id
            const transportRef = ref(db, "/transport/" + transport.id);


            //get transportista name from transList based on "transportista" id
            let transName = "";
            for (let i = 0; i < transList.length; i++) {
                if (transList[i].id === transportista) {
                    transName = transList[i].name;
                }
            }


            update(transportRef, {
                id: transport.id,
                albaraNum: albaraNum,
                clientNum: clientNum,
                address: addressTxt,
                firstTel: firstTel,
                secondTel: secondTel,
                observations: observations,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                status: transportsPending ? "pendiente" : "finalizada",
                transId: transportista,
                transName: transName
            });


        } catch (error: any) {
            alert("error: " + error.message);
            setError(error.message);

        }

        alert("Comanda transport actualitzada correctament")
        //navigate to transport page
        navigate('/transport');


    }

    return (
        <div className="container">
            <Navbar />


            <Alert className="alert" severity="success">Copiat</Alert>

            <div>
                <h1 style={{ textAlign: 'center' }}>Editar comanda transport</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Pujar PDF</h3>
            <Button onClick={() => navigate('/transport')} variant="contained">Tornar</Button>
            <br></br>
            <Button onClick={() => window.open(transport.pdfUrl, "_blank")} variant="contained">Veure PDF</Button>

            <p><b></b></p>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Transportista</InputLabel>
                <Select
                    value={transportista}
                    label="Transportista"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleSelectChange}
                >
                    {/*Map transList */}
                    {transList.map((transportista) => {
                        return <MenuItem key={transportista.id} value={transportista.id}>{transportista.name}</MenuItem>
                    })}
                </Select>
            </FormControl>

            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Num. albarà"
                rows={4}
                value={albaraNum}
                variant="outlined"

                onChange={(e) => setAlbaraNum(e.target.value)}
            />
            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Num. client"
                rows={4}
                value={clientNum}
                variant="outlined"

                onChange={(e) => setClientNum(e.target.value)}
            />
            {/*<p className="data"><b>Tel.:</b></p>
                <div onClick={() => copyData(firstTel)} className="box">
                    <p>{firstTel}</p>
                </div>*/}
            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Telèfon"
                rows={4}
                value={firstTel}
                variant="outlined"

                onChange={(e) => setFirstTel(e.target.value)}
            />
            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Telèfon 2"
                rows={4}
                value={secondTel}
                variant="outlined"

                onChange={(e) => setSecondTel(e.target.value)}
            />

            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Direcció"
                multiline
                rows={4}
                value={addressTxt}
                variant="outlined"

                onChange={(e) => setAddressTxt(e.target.value)}
            />
            {/*Input text multiline MUI*/}
            <TextField style={{ margin: "10px" }}
                id="outlined-multiline-static"
                label="Observacions"
                multiline
                rows={4}
                defaultValue={observations}
                variant="outlined"

                onChange={(e) => setObservations(e.target.value)}
            />

            <div className="display-flex flex-direction-row">
                <FormControlLabel
                    label="Pendents"
                    control={
                        <Checkbox
                            checked={transportsPending}
                            onChange={handleTransportsPendingChange}
                        />
                    }
                />
                <FormControlLabel
                    label="Finalitzats"
                    control={
                        <Checkbox
                            checked={!transportsPending}
                            onChange={handleTransportsPendingChange}
                        />
                    }
                />
            </div>
            <Button onClick={() => uploadTransport()} variant="contained">Editar comanda</Button>

        </div>
    )
}