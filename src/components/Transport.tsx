import { useEffect, useState } from "react";
import { Users } from "../types";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import "./styles/Transport.css"
const Transport = () => {
    const navigate = useNavigate();

    const processesList = ["Comanda1", "Comanda2"]



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
            </Stack>
            <div className="listView">

                {processesList.map((value, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#000000",
                                position: 'relative', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '300px',
                                textAlign: 'left',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '15px',
                                border: '2px solid white',
                                padding: '10px',
                                margin: '10px',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/process', { state: { number: value } })}
                        >
                            <p>{value}</p>
                        </div>

                    );

                })}


            </div>

        </div >
    );
};

export default Transport;