import Navbar from "../Navbar";
import "./styles/AddIncidencia.css"
import { Button, Stack, Checkbox, TextField, Select, SelectChangeEvent, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdminsData, Incidencia, formaRegistreObject, comandaTypeObject } from "../../types";
import { useRef, useState, useEffect } from "react";

import { getDatabase, ref as databaseRef, push, set, onValue, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import firebaseApp from "../../firebase";

import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';



const Incidencies = () => {
    const db = getDatabase(firebaseApp);
    const [timestamp, setTimestamp] = useState('');
    const storage = getStorage(firebaseApp);

    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [date, setDate] = useState<Dayjs | null>(() => {
        setTimestamp(dayjs().valueOf().toString());
        return dayjs();

    }
    );

    const [resolutionTimestamp, setResolutionTimestamp] = useState(dayjs().valueOf.toString());
    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [resolutionDate, setResolutionDate] = useState<Dayjs | null>(() => {
        setResolutionTimestamp(dayjs().valueOf().toString());
        return dayjs();

    });



    const [adminId, setAdminId] = useState(''); const [comandaType, setComandaType] = useState(''); const [adminsList, setAdminsList] = useState<AdminsData[]>([]); const [formaRegistre, setFormaRegistre] = useState('');
    const [adminName, setAdminName] = useState('');

    const [comandaNum, setComandaNum] = useState('');

    const [codiDistribuidor, setCodiDistribuidor] = useState(''); const [nomDistribuidor, setNomDistribuidor] = useState('');

    const [nomTrucador, setNomTrucador] = useState(''); const [correuTrucador, setCorreuTrucador] = useState(''); const [tlfTrucador, setTlfTrucador] = useState('');

    const [direccioClientFinal, setDireccioClientFinal] = useState(''); const [tlfClientFinal, setTlfClientFinal] = useState('');

    const [refProducte, setRefProducte] = useState(''); const [descrProducte, setDescrProducte] = useState('');
    const [resolution, setResolution] = useState('');
    const [comentarisNC, setComentarisNC] = useState('');
    const [comentarisInicialsNC, setComentarisInicialsNC] = useState('');

    const [serveiChecked, setServeiChecked] = useState(false); const [producteChecked, setProducteChecked] = useState(false); const [altresChecked, setAltresChecked] = useState(false);

    const [unresolvedChecked, setUnresolvedChecked] = useState(true);
    const [resolvedChecked, setResolvedChecked] = useState(false);
    const [pendingInfoChecked, setPendingInfoChecked] = useState(false);

    const [producteDisplay, setProducteDisplay] = useState('none');
    const [resolutionDisplay, setResolutionDisplay] = useState('none');

    const [documents, setDocuments] = useState<FileList | null>(null);
    const [documentsNames, setDocumentsNames] = useState<string[]>([]);
    const [documentsUrls, setDocumentsUrls] = useState<string[]>([]);


    const [error, setError] = useState('');


    useEffect(() => {
        var isMounted = false;
        if (isMounted) {
            alert("Error: " + error);
        }
        isMounted = true;
    }, [error]);


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

    const handleResolutionDateChange = (newValue: Dayjs | null) => {
        setResolutionDate(newValue);
        let resolutionTimestamp = newValue?.valueOf();
        setResolutionTimestamp(resolutionTimestamp?.toString() || '');
    };

    const handleServeiCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (producteChecked || altresChecked) {
            setProducteChecked(false);
            setAltresChecked(false);
        }
        setServeiChecked(event.target.checked);

    };

    const handleProducteCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (serveiChecked || altresChecked) {
            setServeiChecked(false);
            setAltresChecked(false);
        }
        setProducteChecked(event.target.checked);

    };
    const handleAltresCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (serveiChecked || producteChecked) {
            setServeiChecked(false);
            setProducteChecked(false);
        }
        setAltresChecked(event.target.checked);

    };

    const handleResolvedChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (unresolvedChecked || pendingInfoChecked) {
            setUnresolvedChecked(false);
            setPendingInfoChecked(false);
        }
        setResolvedChecked(event.target.checked);

    };

    const handleUnresolvedCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (resolvedChecked || pendingInfoChecked) {
            setResolvedChecked(false);
            setPendingInfoChecked(false);
        }
        setUnresolvedChecked(event.target.checked);

    };
    const handlePendingInfoCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (resolvedChecked || unresolvedChecked) {
            setResolvedChecked(false);
            setUnresolvedChecked(false);
        }
        setPendingInfoChecked(event.target.checked);

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



    var mounted = false;


    //get admins list
    useEffect(() => {
        const transportRef = databaseRef(db, "/admins/");

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
        const inconfRef = databaseRef(db, "/incidencies/inconformitats");

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
        const currentDateTimestamp = new Date().getTime();


        if (documents) {
            var documentsUrlsTemp = documentsUrls;
            var documentsNamesTemp = documentsNames;

            for (let i = 0; i < documents.length; i++) {
                const documentsRef = storageRef(storage, `documents/incidencies/${currentDateTimestamp + documents[i].name}`);
                await uploadBytes(documentsRef, documents[i]);
                const documentUrl = await getDownloadURL(documentsRef);
                documentsUrlsTemp.push(documentUrl);
                documentsNamesTemp.push(documents[i].name);
            }
            setDocumentsUrls(documentsUrlsTemp);
            setDocumentsNames(documentsNamesTemp);
        }


        //push to get new key
        let infonformitatRef = push(databaseRef(db, 'incidencies/inconformitats/'));
        let key = infonformitatRef.key;

        if (key) {
            let serveioproducte: string;
            if (serveiChecked) {
                serveioproducte = "servei";
            } else if (producteChecked) {
                serveioproducte = "producte";
            } else if (altresChecked) {
                serveioproducte = "altres";
            } else {
                alert("Has de marcar servei, producte o altres!")
                return;
            }

            let state = 'pendent';
            if (resolvedChecked) {
                state = 'resolta';
            } else if (pendingInfoChecked) {
                state = 'pendentinfo';
            }

            const incidencia: Incidencia = {
                key: key,
                ncNum: ncNum,
                date: timestamp || '',
                adminId: adminId,
                comandaType: comandaType,
                formaRegistre: formaRegistre,
                comandaNum: comandaNum,
                codiDistribuidor: codiDistribuidor,
                nomDistribuidor: nomDistribuidor,
                nomTrucador: nomTrucador,
                correuTrucador: correuTrucador,
                tlfTrucador: tlfTrucador,
                direccioClientFinal: direccioClientFinal,
                tlfClientFinal: tlfClientFinal,
                refProducte: refProducte,
                descrProducte: descrProducte,
                comentarisNC: comentarisNC,
                comentarisInicialsNC: comentarisInicialsNC,
                serveioproducte: serveioproducte,
                documents: documentsUrls || [],
                documentsNames: documentsNames,
                resolucio: resolution || '',
                resolucioTimestamp: resolutionTimestamp || '',
                state: state,
            };
            set(infonformitatRef, incidencia);

        } else {
            alert("error a la base de dades");
        }


        //navigate to transport page
        console.log("Created incidencia")
        navigate('/incidencies');

    }

    function startSendEmail(type: string): void {
        let mailBody;
        let mailSubject;

        switch (type) {
            case 'askInfo':
                //send mail to correuTrucador
                mailBody = "Estimado cliente, le confirmamos que su notificación con referencia NC" + ncNum + " con los comentarios iniciales:\n\n-" + comentarisInicialsNC +"\n\nHa sido parcialmente registrada por falta de información. Información solicitada:\n\n    · (PARA RELLENAR POR EL USUARIO)\n\ny nos mantenemos a la espera de recibir documentación por su parte.\nAgradeceríamos que pudiera responder este email con la información solicitada.\n\nMuy atentamente,\n" + adminName;
                mailSubject = `Notificación NC${ncNum} registrada`;
                //mail to correuTrucador
                sendEmail(correuTrucador, mailSubject, mailBody);
                break;
            case 'sendData':
                //send mail to correuTrucador
                mailBody = "Estimado cliente, le confirmamos que su notificación con referencia NC" + ncNum + " con los comentarios iniciales:\n\n-" + comentarisInicialsNC + "\n\nHa sido correctamente registrada y que en un plazo de 24-48 horas recibirá una respuesta al respecto.\n\nMuy atentamente,\n" + adminName;
                mailSubject = `Notificación NC${ncNum} registrada`;
                //mail to correuTrucador
                sendEmail(correuTrucador, mailSubject, mailBody);
                break;
            case 'resolved':
                //send mail to correuTrucador
                mailBody = "Estimado cliente, le confirmamos que su notificación con referencia NC" + ncNum + " ha sido resuelta.\n\nMuy atentamente,\n" + adminName;
                mailSubject = `Notificación NC${ncNum} registrada`;
                //mail to correuTrucador
                sendEmail(correuTrucador, mailSubject, mailBody);
                break;
            default:
                break;
        }

    }

    function sendEmail(correuTrucador: string, mailSubject: string, mailBody: string) {
        const mail = {
            to: `${correuTrucador}`,
            subject: mailSubject,
            body: encodeURIComponent(mailBody)
        }
        window.open(`mailto:${mail.to}?subject=${mail.subject}&body=${mail.body}`, '_blank');

    }


    function deleteDocument(documentIndex: number) {


        var documentsUrlsTemp = documentsUrls;
        var documentsNamesTemp = documentsNames;



        if (!documentsUrlsTemp || !documentsNamesTemp) return;

        const documentRef = storageRef(storage, documentsUrlsTemp[documentIndex]);

        try {
            deleteObject(documentRef).then(() => {
                console.log("deleted document")
            });
        } catch (error) {
            console.log(error)
        }

        documentsUrlsTemp.splice(documentIndex, 1);
        documentsNamesTemp.splice(documentIndex, 1);

        setDocumentsUrls(documentsUrlsTemp);
        setDocumentsNames(documentsNamesTemp);




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
            </Stack>

            <h3>Dades contacte:</h3>
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
                <Stack sx={{ display: producteDisplay }} spacing={1} direction={{ xs: "column", sm: 'row' }}>
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
                <Stack spacing={1} direction={{ xs: "column", sm: 'row' }}>
                    <div className="d-flex w-100 justify-content-between">
                        <h6 style={{ marginTop: "10px" }}>Producte:</h6>

                        <Checkbox
                            checked={producteChecked}
                            onChange={handleProducteCheck}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                    <div className="d-flex w-100 justify-content-between">

                        <h6 style={{ marginTop: "10px" }}>Servei:</h6>
                        <Checkbox
                            checked={serveiChecked}
                            onChange={handleServeiCheck}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                    <div className="d-flex w-100 justify-content-between">
                        <h6 style={{ marginTop: "10px" }}>Altres:</h6>
                        <Checkbox
                            checked={altresChecked}
                            onChange={handleAltresCheck}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                </Stack>
            </Stack>
            {/*comentaris*/}
            <Stack className="Stack w-50" spacing={1} direction="column">
                <Stack spacing={1} className="w-100" direction="column">
                    <h6>Comentaris inicials:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Comentaris"
                        type="text"
                        multiline
                        rows={4}
                        value={comentarisInicialsNC}
                        variant="outlined"
                        onChange={(e) => {
                            setComentarisInicialsNC(e.target.value)
                        }}
                    />
                </Stack>
            </Stack>
            <Stack className="Stack w-50" spacing={1} direction="column">
                <Stack spacing={1} className="w-100" direction="column">
                    <h6>Comentaris no conformitat:</h6>
                    <TextField
                        id="outlined-multiline-static"
                        label="Comentaris"
                        type="text"
                        multiline
                        rows={4}
                        value={comentarisNC}
                        variant="outlined"
                        onChange={(e) => {
                            setComentarisNC(e.target.value)
                        }}
                    />
                </Stack>
            </Stack>

            <Stack className="Stack" spacing={1} direction="column">
                <Stack sx={{ display: resolutionDisplay }} spacing={1} direction={{ xs: "column", sm: 'row' }}>
                    {/*Resolution*/}
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
                    <Stack spacing={1} direction="column">
                        <h6>Data resolució:</h6>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date&Time picker"
                                value={resolutionDate}
                                onChange={handleResolutionDateChange}
                                inputFormat="DD/MM/YYYY HH:mm"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Stack>

                </Stack>

                <Stack spacing={1} direction={{ xs: "column", sm: 'row' }}>

                    <h6 style={{ marginTop: "10px" }}>Sense resoldre:</h6>
                    <Checkbox
                        checked={unresolvedChecked}
                        onChange={handleUnresolvedCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <h6 style={{ marginTop: "10px" }}>Resolt:</h6>
                    <Checkbox
                        checked={resolvedChecked}
                        onChange={handleResolvedChecked}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />

                    <h6 style={{ marginTop: "10px" }}>Pendent d'informació:</h6>
                    <Checkbox
                        checked={pendingInfoChecked}
                        onChange={handlePendingInfoCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />

                </Stack>

            </Stack>

            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">

                {/*Input for document*/}
                {/*Enviar button*/}
                <div className="form-group">
                    <label htmlFor="documentsInput">Documents: </label><br />
                    <input type="file" multiple className="form-control-file" id="documentsInput" onChange={(e) => setDocuments(e.target.files)} />
                </div>

            </Stack>


            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                {pendingInfoChecked &&
                    <Button onClick={() => startSendEmail("askInfo")} variant="contained">ENVIAR MAIL<br />SOL·LICITUT DADES</Button>}
                {unresolvedChecked &&
                    <Button onClick={() => startSendEmail("sendData")} variant="contained">ENVIAR MAIL<br />DADES COMPLETES</Button>
                }
                {resolvedChecked &&
                    <Button onClick={() => startSendEmail("resolved")} variant="contained">ENVIAR MAIL<br />RESOLUCIÓ</Button>}
            </Stack>
            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                <Button onClick={() => submitIncidencia()} variant="contained">NOVA NO CONFORMITAT</Button>
            </Stack>
        </div >
    );

}

export default Incidencies;


