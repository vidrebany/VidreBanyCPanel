import { useEffect, useState } from "react";
import { Transports } from "../../types";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TransportationOptions } from "./components/TransportationOptions";
import "./styles/Transport.css"
import { Checkbox, FormControlLabel } from '@mui/material';



const Transport = () => {
    const navigate = useNavigate();

    //firebase database
    const db = getDatabase(firebaseApp);
    //transport ref
    const transportRef = ref(db, "/transport/");

    //transport list useState that has a list of Transports[] objects
    const [transportList, setTransportList] = useState<Transports[]>([]);
    const [transportsPending, setTransportsPending] = useState<boolean>(false);


    //get transport list
    useEffect(() => {
        onValue(transportRef, (snapshot) => {
            const data = snapshot.val();

            let transportListTemp: Transports[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let transportOrder: Transports = {
                        id: data[key].id,
                        albaraNum: data[key].albaraNum,
                        address: data[key].address,
                        clientNum: data[key].clientNum,
                        date: data[key].date,
                        firstTel: data[key].firstTel,
                        secondTel: data[key].secondTel,
                        observations: data[key].observations,
                        pdfUrl: data[key].pdfUrl,
                        status: data[key].status,
                        time: data[key].time,
                        transId: data[key].transId,
                        transName: data[key].transName,
                    }
                    if (transportsPending && transportOrder.status === "pendiente") {
                        transportListTemp.push(transportOrder);
                    } else if (!transportsPending && transportOrder.status === "finalizada") {
                        transportListTemp.push(transportOrder);
                    }
                }
            }




            setTransportList(transportListTemp);



        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transportsPending]);

    const handleTransportsPendingChange = () => {
        if (transportsPending) {
            setTransportsPending(false);
        } else {
            setTransportsPending(true);
        }
    };







    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <div>
                <h1 style={{ textAlign: 'center' }}>Transports</h1>
            </div>


            <h3>Lista commandes</h3>
            <Stack spacing={2} direction="column">
                <Button onClick={() => navigate('/addtransportorder')} variant="contained">Afegir comanda</Button>
                <Button onClick={() => navigate('/transporters')} variant="contained">Configuració Transports</Button>
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

            </Stack>
            <div className="listView">

                {/*Map transportList*/}
                {transportList.length > 0 ?
                    transportList.map((transport) => {
                        return (
                            <div className="transportCard" key={transport.id}>
                                <h3>{transport.albaraNum} {transport.transName}</h3>
                                <p>{transport.address}
                                </p>
                                <p><b>{transport.status}</b></p>
                                {/*More options button on top right of transportCard*/}

                                <TransportationOptions transport={transport} />



                            </div>
                        );
                    }) : <p>No hi ha comandes</p>}


            </div>

        </div >
    );
};

export default Transport;