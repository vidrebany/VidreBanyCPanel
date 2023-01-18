import { useEffect, useState } from "react";
import { Transports } from "../../types";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import "./styles/Transport.css"
const Transport = () => {
    const navigate = useNavigate();

    //firebase database
    const db = getDatabase(firebaseApp);
    //transport ref
    const transportRef = ref(db, "/transport/");

    //transport list useState that has a list of Transports[] objects
    const [transportList, setTransportList] = useState<Transports[]>([]);

    //get transport list
    useEffect(() => {
        onValue(transportRef, (snapshot) => {
            const data = snapshot.val();

            let transportListTemp: Transports[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let transportOrder: Transports = {
                        id: data[key].id,
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
                    transportListTemp.push(transportOrder);
                }
            }

            //alert(JSON.stringify(transportListTemp[0].id)); 


  
                setTransportList(transportListTemp);
            


        });
    }, [transportRef]);







    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <Navbar />
            <div>
                <h1 style={{ textAlign: 'center' }}>Transports</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Lista commandes</h3>
            <Stack spacing={2} direction="column">
                <Button onClick={() => navigate('/addtransportorder')} variant="contained">Afegir comanda</Button>
                <Button onClick={() => navigate('/transporters')} variant="contained">Transportistes</Button>
            </Stack>
            <div className="listView">

                {/*Map transportList*/}
                {transportList.map((transport) => {
                    return (
                        <div className="transportCard" key={transport.id}>
                            <h3>{transport.clientNum} {transport.transName}</h3>
                            <p>Adreça: {transport.address}
                            </p>
                        </div>
                    );
                })}


            </div>

        </div >
    );
};

export default Transport;