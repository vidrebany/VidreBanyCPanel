import Navbar from "./Navbar";
import "./styles/AddIncidencia.css"
import { Button, Stack, Input, Checkbox, FormControlLabel, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';



const Incidencies = () => {

    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [date, setDate] = useState<Dayjs | null>(
        dayjs(),
    );


    const [ncNum, setNcNum] = useState('');
    const [cClient, setcClient] = useState('');
    const [nClient, setnClient] = useState('');

    const [serviciChecked, setserviciChecked] = useState(false);
    const [producteChecked, setProducteChecked] = useState(false);


    const handleDateChange = (newValue: Dayjs | null) => {
        setDate(newValue);
    };
    const handleServiciCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setserviciChecked(event.target.checked);
    };
    const handleProducteCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProducteChecked(event.target.checked);
    };


    const navigate = useNavigate();


    return (
        <div>
            <Navbar />
            <h1>Afegir incidència</h1>
            <Button onClick={() => navigate('/incidencies')} variant="contained">Tornar</Button>

            <Stack className="MasterStack" spacing={4} direction="column">

                {/*NC (field for Número Comanda*/}
                <Stack className="Stack" spacing={1} direction="row">
                    <h6>NC:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Núm. no conformitat"
                        type="number"
                        value={ncNum}
                        variant="outlined"

                        onChange={(e) => setNcNum(e.target.value)}
                    />

                </Stack>
                {/*Fecha (select date and time using MUI)*/}
                <Stack className="Stack" spacing={1} direction="row">

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <h6>Data:</h6>
                        <DateTimePicker
                            label="Date&Time picker"
                            value={date}
                            onChange={handleDateChange}
                            inputFormat="DD/MM/YYYY HH:mm"
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>

                {/*C. Cliente (field for client code)*/}
                <Stack className="Stack" spacing={1} direction="row">
                    <h6>C. Client:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Codi client"
                        type="number"
                        value={cClient}
                        variant="outlined"
                        onChange={(e) => setcClient(e.target.value)}
                    />
                </Stack>
                {/*Nombre (field for client name)*/}
                <Stack className="Stack" spacing={1} direction="row">
                    <h6>Nom cl.:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Nom client"
                        type="text"
                        value={nClient}
                        variant="outlined"
                        onChange={(e) => setnClient(e.target.value)}
                    />
                </Stack>
                {/*Servicio (checkbox)*/}
                <Stack className="StackCheck" spacing={1} direction="row">
                    <h6>És Servici:</h6>
                    <Checkbox
                        checked={serviciChecked}
                        onChange={handleServiciCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
                <Stack className="StackCheck" spacing={1} direction="row">
                    <h6>És Producte:</h6>
                    <Checkbox
                        checked={producteChecked}
                        onChange={handleProducteCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
                {/*Producto (checkbox)*/}
                {/*Nº albarán (field for número albarán*/}
                {/*Ref. producto (field for referencia de producto)*/}
                {/*Descripción (field multiline for descripción)*/}
                {/*Comentarios (field multiline for comments)*/}
                {/*Input for document*/}
                {/*Resolución (multiline field)*/}
                {/*Resuelto (select)*/}
                {/*Enviar button*/}

            </Stack>
        </div>
    );

}

export default Incidencies;