import Navbar from "./Navbar";
import "./styles/AddIncidencia.css"
import { Button, Stack, Checkbox, FormControlLabel, TextField, Select, SelectChangeEvent, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdminsData, formaRegistreObject, comandaTypeObject } from "../types";
import { useRef, useState, useEffect } from "react";

import { getDatabase, ref, push, set, DatabaseReference, onValue } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from "../firebase";

import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';



const Incidencies = () => {
    const db = getDatabase(firebaseApp);

    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [date, setDate] = useState<Dayjs | null>(
        dayjs(),
    );

    const [admin, setAdmin] = useState(''); const [comandaType, setComandaType] = useState(''); const [adminsList, setAdminsList] = useState<AdminsData[]>([]); const [formaRegistre, setFormaRegistre] = useState('');


    const [ncNum, setNcNum] = useState('');
    const [comandaNum, setComandaNum] = useState('');

    const [codiDistribuidor, setCodiDistribuidor] = useState(''); const [nomDistribuidor, setNomDistribuidor] = useState(''); const [correuDistribuidor, setCorreuDistribuidor] = useState('');

    const [nomTrucador, setNomTrucador] = useState(''); const [correuTrucador, setCorreuTrucador] = useState(''); const [tlfTrucador, setTlfTrucador] = useState('');

    const [direccioClientFinal, setDireccioClientFinal] = useState(''); const [tlfClientFinal, setTlfClientFinal] = useState('');

    const [refProducte, setRefProducte] = useState(''); const [descrProducte, setDescrProducte] = useState('');

    const [comentarisNC, setComentarisNC] = useState('');

    const [serveiChecked, setServeiChecked] = useState(false); const [producteChecked, setProducteChecked] = useState(false);
    
    const [error, setError] = useState('');


    const handleFormaRegistreSelectChange = (event: SelectChangeEvent) => {
        setFormaRegistre(event.target.value as string);
    };
    const handleComandaTypeSelectChange = (event: SelectChangeEvent) => {
        setComandaType(event.target.value as string);
    };
    const handleRegistradorSelectChange = (event: SelectChangeEvent) => {
        setAdmin(event.target.value as string);

    };
    const handleDateChange = (newValue: Dayjs | null) => {
        setDate(newValue);
    };
    const handleServeiCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (producteChecked) {
            setProducteChecked(false);
        }
        setServeiChecked(event.target.checked);

    };
    const handleProducteCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (serveiChecked) {
            setServeiChecked(false);
        }
        setProducteChecked(event.target.checked);

    };


    const [fileTitle, setFileTitle] = useState('ADJUNTAR ARXIU');
    const [file, setFile] = useState<File | null | undefined>(null);


    const inputFileRef = useRef<HTMLInputElement>(null);
    const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        let fileInput = e.target.files?.item(0);
        setFile(fileInput);
        setFileTitle(fileInput?.name || 'ADJUNTAR ARXIU');
    }
    const inputFileClick = () => {
        inputFileRef.current?.click();
    };


    var mounted = false;


    //get admins list
    useEffect(() => {
        const transportRef = ref(db, "/admins/");

        onValue(transportRef, (snapshot) => {
            const data = snapshot.val();

            let adminsListTemp: AdminsData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let adminRegistrador: AdminsData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    adminsListTemp.push(adminRegistrador);
                }
            }



            if (!mounted) {
                setAdminsList(adminsListTemp);

            }


            // eslint-disable-next-line react-hooks/exhaustive-deps
            mounted = true;
        });
    }, [adminsList]);



    const navigate = useNavigate();


    function submitIncidencia(): void {

        console.log('submitting');
        console.log("date: "+date);
        console.log("admin: "+admin);
        console.log("comandaType: "+comandaType);
        console.log("formaRegistre: "+formaRegistre);
        console.log("ncNum: "+ncNum);
        console.log("comandaNum: "+comandaNum);
        console.log("codiDistribuidor: "+codiDistribuidor);
        console.log("nomDistribuidor: "+nomDistribuidor);
        console.log("correuDistribuidor: "+correuDistribuidor);
        console.log("nomTrucador: "+nomTrucador);
        console.log("correuTrucador: "+correuTrucador);
        console.log("tlfTrucador: "+tlfTrucador);
        console.log("direccioClientFinal: "+direccioClientFinal);
        console.log("tlfClientFinal: "+tlfClientFinal);
        console.log("refProducte: "+refProducte);
        console.log("descrProducte: "+descrProducte);
        console.log("comentarisNC: "+comentarisNC);
        console.log("serveiChecked: "+serveiChecked);
        console.log("producteChecked: "+producteChecked);
        console.log("file: "+file);
        console.log("fileTitle: "+fileTitle);

          //get realtime database ref and push
/*
          try {

            try {
                //get firebaseStorage from firebase
                const storage = getStorage(firebaseApp);

                //upload the file to storage, no matter if imports are not specified
                var storageRef: any;
                try {
                    storageRef = refStorage(storage, 'incidencies/noconformitats/' + fileTitle);
                } catch (error) {
                    console.log(error);
                }
                uploadBytesResumable(storageRef, file as Blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    //get download url
                    getDownloadURL(snapshot.ref).then((url) => {


                        try {
                            const dbRef = ref(db, 'incidencies');

                            const newTransportRef = push(dbRef);
                            //get key from newTransportRef
                            const key = newTransportRef.key;

                            //get transportista name from transList based on "transportista" id
                            let transName = "";
                            
                            set(newTransportRef, {
                                id: key,
                                clientNum: clientNum,
                                address: addressTxt,
                                firstTel: firstTel,
                                secondTel: secondTel,
                                observations: observations,
                                date: new Date().toLocaleDateString(),
                                time: new Date().toLocaleTimeString(),
                                status: "pendiente",
                                pdfUrl: url,
                                transId: transportista,
                                transName: transName
                            });
                            
                        } catch (error: any) {
                            alert("error: " + error.message);
                        }


                    });
                });

            } catch (error: any) {
                setError(error.message);
                alert("Ja existeix un arxiu com aquest" + error.message);
            }





        } catch (error: any) {

            setError(error.message);
            console.log(error.message);

        }

        //navigate to transport page
        navigate('/incidencies');
*/
    }

    return (
        <div>
            <Navbar />
            <input type='file' name='file' id='file' ref={inputFileRef} onChangeCapture={onFileChangeCapture}
                style={{ display: 'none' }}
                accept="*"
                multiple={false} />
            <h1>Afegir inconformitat</h1>
            <Button onClick={() => navigate('/incidencies')} variant="contained">Tornar</Button>

            <Stack className="MasterStack" spacing={4} direction="column">

                <div className="select">
                    <FormControl sx={{ margin: '10px' }} fullWidth>
                        <InputLabel id="demo-simple-select-label">Forma de registre</InputLabel>
                        <Select
                            value={formaRegistre}
                            label="Forma de registre"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={handleFormaRegistreSelectChange}
                        >
                            {/*Map transList */}

                            {formaRegistreObject.map((formaRegistre) => {

                                return <MenuItem key={formaRegistre.key} value={formaRegistre.name}>{formaRegistre.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>


                    <FormControl sx={{ margin: '10px' }} fullWidth>
                        <InputLabel id="demo-simple-select-label">Registrador</InputLabel>
                        <Select
                            value={admin}
                            label="Registrador"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={handleRegistradorSelectChange}
                        >
                            {/*Map transList */}
                            {adminsList.map((admin) => {
                                return <MenuItem key={admin.id} value={admin.name}>{admin.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
            </Stack>

            {/*NC (field for Número Comanda*/}
            <Stack className="Stack" spacing={1} direction="row">
                <Stack spacing={1} direction="column">

                    <h6>NC:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Núm. no conformitat"
                        type="text"
                        value={ncNum}
                        variant="outlined"

                        onChange={(e) => setNcNum(e.target.value)}
                    />
                </Stack>
                {/*Fecha (select date and time using MUI)*/}
                <Stack spacing={1} direction="column">

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
                <Stack spacing={2} direction="column">
                    <h6>Nº</h6>
                    <FormControl sx={{ margin: '10px' }} fullWidth>
                        <InputLabel id="demo-simple-select-label">Tipus comanda</InputLabel>
                        <Select
                            value={comandaType}
                            label="Tipus comanda"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={handleComandaTypeSelectChange}
                        >
                            {/*Map transList */}
                            {comandaTypeObject.map((comandaType) => {
                                return <MenuItem key={comandaType.key} value={comandaType.type}>{comandaType.type}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <TextField
                        id="outlined-multiline-static"
                        label="0000"
                        type="text"
                        value={comandaNum}
                        variant="outlined"

                        onChange={(e) => setComandaNum(e.target.value)}
                    />
                </Stack>

            </Stack>


            <h3>Dades distribuïdor:</h3>
            {/*C. Distribuidor (field for distributor code)*/}
            <Stack className="Stack" spacing={1} direction="row">
                <h6>Codi:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="0000"
                    type="text"
                    value={codiDistribuidor}
                    variant="outlined"
                    onChange={(e) => setCodiDistribuidor(e.target.value)}
                />
                {/*Nombre (field for distributor name)*/}

                <h6>Nom:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="Nom distribuïdor"
                    type="text"
                    value={nomDistribuidor}
                    variant="outlined"
                    onChange={(e) => setNomDistribuidor(e.target.value)}
                />
                {/*Correu (field for distributor email)*/}
                <h6>Correu:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="exemple@mail.com"
                    type="text"
                    value={correuDistribuidor}
                    variant="outlined"
                    onChange={(e) => setCorreuDistribuidor(e.target.value)}
                />
            </Stack>

            <h3>Dades trucador:</h3>
            {/*Nom trucador*/}
            <Stack className="Stack" spacing={1} direction="row">
                <h6>Nom:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="Nom trucador"
                    type="text"
                    value={nomTrucador}
                    variant="outlined"
                    onChange={(e) => setNomTrucador(e.target.value)}
                />
                {/*Correu trucador*/}

                <h6>Correu:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="mail@exemple.cat"
                    type="text"
                    value={correuTrucador}
                    variant="outlined"
                    onChange={(e) => setCorreuTrucador(e.target.value)}
                />
                {/*Tlf*/}
                <h6>Tlf.:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="600000000"
                    type="text"
                    value={tlfTrucador}
                    variant="outlined"
                    onChange={(e) => setTlfTrucador(e.target.value)}
                />
            </Stack>
            <h3>Dades client final:</h3>
            {/*Nom trucador*/}
            <Stack className="Stack" spacing={1} direction="row">
                {/*Direcció client final */}
                <h6>Direcció:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="Av. de la Pau, 1"
                    type="text"
                    value={direccioClientFinal}
                    variant="outlined"
                    onChange={(e) => setDireccioClientFinal(e.target.value)}
                />
                {/*Tlf*/}
                <h6>Tlf.:</h6>
                <TextField
                    id="outlined-multiline-static"
                    label="600000000"
                    type="text"
                    value={tlfClientFinal}
                    variant="outlined"
                    onChange={(e) => setTlfClientFinal(e.target.value)}
                />
            </Stack>




            <h3>Dades producte:</h3>
            <Stack className="Stack" spacing={1} direction="column">
                <Stack spacing={1} direction="row">
                    <Stack spacing={1} direction="column">

                        <h6>Ref. producte:</h6>
                        <TextField
                            id="outlined-multiline-static"
                            label="0000"
                            type="text"
                            value={refProducte}
                            variant="outlined"
                            onChange={(e) => setRefProducte(e.target.value)}
                        />
                    </Stack>
                    {/*Tlf*/}
                    <Stack spacing={1} direction="column">
                        <h6>Descripció:</h6>
                        <TextField
                            id="outlined-multiline-static"
                            label="Descripció del producte"
                            type="text"
                            multiline
                            rows={2}
                            value={descrProducte}
                            variant="outlined"
                            onChange={(e) => {
                                setDescrProducte(e.target.value)
                            }}
                        />
                    </Stack>
                </Stack>
                <Stack spacing={1} direction="row">

                    <h6 style={{ marginTop: "10px" }}>És Producte:</h6>
                    <Checkbox
                        checked={producteChecked}
                        onChange={handleProducteCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <h6 style={{ marginTop: "10px" }}>És Servei:</h6>
                    <Checkbox
                        checked={serveiChecked}
                        onChange={handleServeiCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Stack>
            {/*comentaris*/}
            <Stack className="Stack" spacing={1} direction="column">
                <Stack spacing={1} direction="column">
                    <h6>Comentaris no conformitat:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Comentaris"
                        type="text"
                        multiline
                        rows={2}
                        value={comentarisNC}
                        variant="outlined"
                        onChange={(e) => {
                            setComentarisNC(e.target.value)
                        }}
                    />
                </Stack>
            </Stack>

            {/*Servicio (checkbox)*/}
            <Stack style={{margin: "30px"}}className="StackCheck" spacing={1} direction="row">

                <Button onClick={inputFileClick} variant="contained">{fileTitle}</Button>
                {/*Input for document*/}
                {/*Enviar button*/}
            </Stack>
            <Stack style={{margin: "30px"}} className="StackCheck" spacing={1} direction="row">
                <Button onClick={() => submitIncidencia()} variant="contained">NOVA INCIDÈNCIA</Button>
            </Stack>
        </div >
    );

}

export default Incidencies;