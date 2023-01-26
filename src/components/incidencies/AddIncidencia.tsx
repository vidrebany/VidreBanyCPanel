import Navbar from "../Navbar";
import "./styles/AddIncidencia.css"
import { Button, Stack, Checkbox, FormControlLabel, TextField, Select, SelectChangeEvent, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdminsData, Incidencia, formaRegistreObject, comandaTypeObject } from "../../types";
import { useRef, useState, useEffect } from "react";

import { getDatabase, ref, push, set, DatabaseReference, onValue } from "firebase/database";
import { getStorage, ref as refStorage, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from "../../firebase";

import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';



const Incidencies = () => {
    const db = getDatabase(firebaseApp);
    const [timestamp, setTimestamp] = useState('');

    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [date, setDate] = useState<Dayjs | null>(() => {
        setTimestamp(dayjs().valueOf().toString());
        return dayjs();

    }
    );

    const [adminId, setAdminId] = useState(''); const [comandaType, setComandaType] = useState(''); const [adminsList, setAdminsList] = useState<AdminsData[]>([]); const [formaRegistre, setFormaRegistre] = useState('');
    const [adminName, setAdminName] = useState('');

    const [comandaNum, setComandaNum] = useState('');

    const [codiDistribuidor, setCodiDistribuidor] = useState(''); const [nomDistribuidor, setNomDistribuidor] = useState(''); const [correuDistribuidor, setCorreuDistribuidor] = useState('');

    const [nomTrucador, setNomTrucador] = useState(''); const [correuTrucador, setCorreuTrucador] = useState(''); const [tlfTrucador, setTlfTrucador] = useState('');

    const [direccioClientFinal, setDireccioClientFinal] = useState(''); const [tlfClientFinal, setTlfClientFinal] = useState('');

    const [refProducte, setRefProducte] = useState(''); const [descrProducte, setDescrProducte] = useState('');
    const [resolution, setResolution] = useState('');
    const [comentarisNC, setComentarisNC] = useState('');

    const [serveiChecked, setServeiChecked] = useState(false); const [producteChecked, setProducteChecked] = useState(false);
    
    const [resolvedChecked, setResolvedChecked] = useState(false);
    const [unresolvedChecked, setUnresolvedChecked] = useState(true);

    const [producteDisplay, setProducteDisplay] = useState('none');
    const [resolutionDisplay, setResolutionDisplay] = useState('none');

    const [error, setError] = useState('');


    const handleFormaRegistreSelectChange = (event: SelectChangeEvent) => {
        setFormaRegistre(event.target.value as string);
    };
    const handleComandaTypeSelectChange = (event: SelectChangeEvent) => {
        setComandaType(event.target.value as string);
    };
    const handleRegistradorSelectChange = (event: SelectChangeEvent) => {
        setAdminId(event.target.value as string);
        let adminName = adminsList.find(admin => admin.id === event.target.value)?.name;
        setAdminName(adminName || '');


    };
    const handleDateChange = (newValue: Dayjs | null) => {
        setDate(newValue);
        let timestamp = newValue?.valueOf();
        setTimestamp(timestamp?.toString() || '');
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

    const handleResolvedChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (unresolvedChecked) {
            setUnresolvedChecked(false);
        }
        setResolvedChecked(event.target.checked);

    };

    const handleUnresolvedCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (resolvedChecked) {
            setResolvedChecked(false);
        }
        setUnresolvedChecked(event.target.checked);

    };


    const [fileTitle, setFileTitle] = useState('SENSE ARXIU');
    const [file, setFile] = useState<File | null | undefined>(null);
    const [ncNum, setNcNum] = useState(0);


    const inputFileRef = useRef<HTMLInputElement>(null);
    const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        let fileInput = e.target.files?.item(0);
        setFile(fileInput);
        setFileTitle(fileInput?.name || 'SENSE ARXIU');
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

    useEffect(() => {

        if (producteChecked) {
            setProducteDisplay('');
        } else {
            setProducteDisplay('none');
            setRefProducte('');
            setDescrProducte('');
        }
    }, [producteChecked])

    useEffect(() => {

        if (resolvedChecked) {
            setResolutionDisplay('');
        } else {
            setResolutionDisplay('none');
            setRefProducte('');
            setDescrProducte('');
        }
    }, [resolvedChecked])


    //get no conformitats list
    useEffect(() => {
        const inconfRef = ref(db, "/incidencies/inconformitats");

        onValue(inconfRef, (snapshot) => {
            const data = snapshot.val();
            let lastNc = 1;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    lastNc++;
                }
            }


            setNcNum(lastNc);


        });
    }, [db, ncNum]);



    const navigate = useNavigate();


    async function submitIncidencia() {

        /*
                console.log('submitting');
                console.log("date: " + date);
                console.log("adminId: " + adminId);
                console.log("comandaType: " + comandaType);
                console.log("formaRegistre: " + formaRegistre);
                console.log("ncNum: " + ncNum);
                console.log("comandaNum: " + comandaNum);
                console.log("codiDistribuidor: " + codiDistribuidor);
                console.log("nomDistribuidor: " + nomDistribuidor);
                console.log("correuDistribuidor: " + correuDistribuidor);
                console.log("nomTrucador: " + nomTrucador);
                console.log("correuTrucador: " + correuTrucador);
                console.log("tlfTrucador: " + tlfTrucador);
                console.log("direccioClientFinal: " + direccioClientFinal);
                console.log("tlfClientFinal: " + tlfClientFinal);
                console.log("refProducte: " + refProducte);
                console.log("descrProducte: " + descrProducte);
                console.log("comentarisNC: " + comentarisNC);
                console.log("serveiChecked: " + serveiChecked);
                console.log("producteChecked: " + producteChecked);
                console.log("file: " + file);
                console.log("fileTitle: " + fileTitle);
        */

        //get realtime database ref and push

        try {

            try {
                let serveioproducte: string;
                if (serveiChecked) {
                    serveioproducte = "servei";
                } else if (producteChecked) {
                    serveioproducte = "producte";
                } else {
                    alert("Has de marcar servei o producte!")
                    return;
                }
                //get firebaseStorage from firebase
                const storage = getStorage(firebaseApp);

                //upload the file to storage, no matter if imports are not specified
                var storageRef: any;
                try {
                    storageRef = refStorage(storage, 'incidencies/inconformitats/' + fileTitle);
                } catch (error) {
                    console.log(error);
                }
                if (fileTitle === 'SENSE ARXIU') {
                    try {
                        const dbRef = ref(db, 'incidencies/inconformitats/');

                        const newIncidenciaRef = push(dbRef);
                        //get key from newIncidenciaRef
                        const dbKey = newIncidenciaRef.key;
                        if (dbKey) {

                            const incidencia: Incidencia = {
                                key: dbKey,
                                ncNum: ncNum,
                                date: timestamp || '',
                                adminId: adminId,
                                comandaType: comandaType,
                                formaRegistre: formaRegistre,
                                comandaNum: comandaNum,
                                codiDistribuidor: codiDistribuidor,
                                nomDistribuidor: nomDistribuidor,
                                correuDistribuidor: correuDistribuidor,
                                nomTrucador: nomTrucador,
                                correuTrucador: correuTrucador,
                                tlfTrucador: tlfTrucador,
                                direccioClientFinal: direccioClientFinal,
                                tlfClientFinal: tlfClientFinal,
                                refProducte: refProducte,
                                descrProducte: descrProducte,
                                comentarisNC: comentarisNC,
                                serveioproducte: serveioproducte,
                                downloadURL: '',
                                fileTitle: '',
                                resolucio: resolution || '',
                                state: resolvedChecked ? 'resolta' : 'pendent',
                            };
                            set(newIncidenciaRef, incidencia);

                        } else {
                            alert("error a la base de dades");
                        }




                    } catch (error: any) {
                        alert("error: " + error.message);
                    }
                } else {
                    await uploadBytesResumable(storageRef, file as Blob).then((snapshot) => {
                        console.log('Uploaded a blob or file!');

                        //get download url
                        getDownloadURL(snapshot.ref).then((downloadURL) => {

                            try {
                                const dbRef = ref(db, 'incidencies/inconformitats/');

                                const newIncidenciaRef = push(dbRef);
                                //get key from newIncidenciaRef
                                const dbKey = newIncidenciaRef.key;
                                if (dbKey) {

                                    const incidencia: Incidencia = {
                                        key: dbKey,
                                        ncNum: ncNum,
                                        date: timestamp || '',
                                        adminId: adminId,
                                        comandaType: comandaType,
                                        formaRegistre: formaRegistre,
                                        comandaNum: comandaNum,
                                        codiDistribuidor: codiDistribuidor,
                                        nomDistribuidor: nomDistribuidor,
                                        correuDistribuidor: correuDistribuidor,
                                        nomTrucador: nomTrucador,
                                        correuTrucador: correuTrucador,
                                        tlfTrucador: tlfTrucador,
                                        direccioClientFinal: direccioClientFinal,
                                        tlfClientFinal: tlfClientFinal,
                                        refProducte: refProducte,
                                        descrProducte: descrProducte,
                                        comentarisNC: comentarisNC,
                                        serveioproducte: serveioproducte,
                                        downloadURL: downloadURL,
                                        fileTitle: fileTitle,
                                        resolucio: resolution || '',
                                        state: resolvedChecked ? 'resolta' : 'pendent',
                                
                                    };
                                    set(newIncidenciaRef, incidencia);

                                } else {
                                    alert("error a la base de dades");
                                }




                            } catch (error: any) {
                                alert("error: " + error.message);
                            }


                        });
                    });
                }

            } catch (error: any) {
                setError(error.message);
                alert("Ja existeix un arxiu com aquest" + error.message);
            }





        } catch (error: any) {

            setError(error.message);
            console.log(error.message);

        }

        //navigate to transport page
        console.log("Created incidencia")
        navigate('/incidenciesobertes');

    }

    function startSendEmail(): void {
        //send mail to correuTrucador and correuDistribuidor
        /*Estimado cliente,
        Le confirmamos que su notificación con referencia NC{ncNum}
        ha sido correctamente registrada y que en un plazo de 24-48 horas
        recibirá una respuesta al respecto.
        Comentarios no conformidad:
        {comentarisNC}
        
        Muy atentamente,
        {adminName}
        */
        const mailBody = "Estimado cliente,\nLe confirmamos que su notificación con referencia NC" + ncNum + "\nha sido correctamente registrada y que en un plazo de 24-48 horas\nrecibirá una respuesta al respecto.\n\nComentarios no conformidad:\n" + comentarisNC + "\n\nMuy atentamente,\n" + adminName;
        const mailSubject = `Notificación NC${ncNum} registrada`;
        //mail to correuTrucador and correuDistribuidor
        sendEmail(correuTrucador, correuDistribuidor, mailSubject, mailBody);
    }

    function sendEmail(correuTrucador: string, correuDistribuidor: string, mailSubject: string, mailBody: string) {
        const mail = {
            to: `${correuTrucador},${correuDistribuidor}`,
            subject: mailSubject,
            body: encodeURIComponent(mailBody)
        }
        window.open(`mailto:${mail.to}?subject=${mail.subject}&body=${mail.body}`, '_blank');

    }

    return (
        <div>
            <Navbar />
            <input type='file' name='file' id='file' ref={inputFileRef} onChangeCapture={onFileChangeCapture}
                style={{ display: 'none' }}
                accept="*"
                multiple={false} />
            <h1>Afegir nova no conformitat</h1>
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
                            value={adminId}
                            label="Registrador"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={handleRegistradorSelectChange}
                        >
                            {/*Map transList */}
                            {adminsList.map((admin) => {
                                return <MenuItem key={admin.id} value={admin.id}>{admin.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
            </Stack>

            {/*NC (field for Número Comanda*/}
            <Stack className="Stack" spacing={1} direction={{ xs: "column", sm: 'row' }}>
                <Stack spacing={1} direction="column">

                    <h6>NC:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Núm. no conformitat"
                        type="text"
                        value={ncNum}
                        variant="outlined"

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
            <Stack className="Stack" spacing={1} direction={{ xs: "column", sm: 'row' }}>
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
            <Stack className="Stack" spacing={1} direction={{ xs: "column", sm: 'row' }}>
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
            <Stack className="Stack" spacing={1} direction={{ xs: "column", sm: 'row' }}>
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
                <Stack sx={{ display: producteDisplay }} spacing={1} direction="row">
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

            <Stack className="Stack" spacing={1} direction="column">
                <Stack sx={{ display: resolutionDisplay }} spacing={1} direction="row">
                    {/*Tlf*/}
                    <Stack spacing={1} direction="column">
                        <h6>Resolució:</h6>
                        <TextField
                            id="outlined-multiline-static"
                            label="Resolució no conformitat"
                            type="text"
                            multiline
                            rows={2}
                            value={resolution}
                            variant="outlined"
                            onChange={(e) => {
                                setResolution(e.target.value)
                            }}
                        />
                    </Stack>
                </Stack>
                <Stack spacing={1} direction="row">

                    <h6 style={{ marginTop: "10px" }}>Resolt:</h6>
                    <Checkbox
                        checked={resolvedChecked}
                        onChange={handleResolvedChecked}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <h6 style={{ marginTop: "10px" }}>Sense resoldre:</h6>
                    <Checkbox
                        checked={unresolvedChecked}
                        onChange={handleUnresolvedCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Stack>

            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">

                <Button onClick={inputFileClick} variant="contained">{fileTitle}</Button>
                {/*Input for document*/}
                {/*Enviar button*/}
            </Stack>
            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                <Button onClick={() => startSendEmail()} variant="contained">ENVIAR MAIL</Button>
            </Stack>
            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                <Button onClick={() => submitIncidencia()} variant="contained">NOVA NO CONFORMITAT</Button>
            </Stack>
        </div >
    );

}

export default Incidencies;


