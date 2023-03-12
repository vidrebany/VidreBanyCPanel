import Navbar from "../Navbar";
import "./styles/AddIncidencia.css"
import { Button, Stack, Checkbox, TextField, Select, SelectChangeEvent, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdminsData, Incidencia, formaRegistreObject, comandaTypeObject } from "../../types";
import { useRef, useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage, ref as refStorage, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from "../../firebase";

import { useLocation, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';



const EditInconformitat = () => {

    var incidenciaKey: string = '';
    const location = useLocation();
    //create an Object.entries array from the location object, if key is state, return the value of the number key
    Object.entries(location).forEach(([key, value]) => {
        if (key === "state") {
            incidenciaKey = value.incidenciaKey;
        }
    });


    //firebase database
    const db = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);
    //incidenciesRef
    const incidenciesRef = ref(db, `/incidencies/inconformitats/${incidenciaKey}`);

    //get one Incidencia interface object
    const [incidencia, setIncidencia] = useState<Incidencia>();

    const [timestamp, setTimestamp] = useState(dayjs().valueOf.toString());
    const [resolutionTimestamp, setResolutionTimestamp] = useState(dayjs().valueOf.toString());

    //get current date and time (in day month year minutes and hours format) using dayjs and transforming to Dayjs type
    const [date, setDate] = useState<Dayjs | null>(
        dayjs(),
    );
    const [resolutionDate, setResolutionDate] = useState<Dayjs | null>(
        dayjs(),
    );

    const [adminId, setAdminId] = useState(''); const [comandaType, setComandaType] = useState(''); const [adminsList, setAdminsList] = useState<AdminsData[]>([]); const [formaRegistre, setFormaRegistre] = useState('');
    const [adminName, setAdminName] = useState('');

    const [comandaNum, setComandaNum] = useState('');

    const [codiDistribuidor, setCodiDistribuidor] = useState(''); const [nomDistribuidor, setNomDistribuidor] = useState('');

    const [nomTrucador, setNomTrucador] = useState(''); const [correuTrucador, setCorreuTrucador] = useState(''); const [tlfTrucador, setTlfTrucador] = useState('');

    const [direccioClientFinal, setDireccioClientFinal] = useState(''); const [tlfClientFinal, setTlfClientFinal] = useState('');
    const [resolution, setResolution] = useState('');

    const [refProducte, setRefProducte] = useState(''); const [descrProducte, setDescrProducte] = useState('');

    const [comentarisNC, setComentarisNC] = useState('');
    const [downloadURL, setDownloadURL] = useState('');
    const [state, setState] = useState('');
    const [serveiChecked, setServeiChecked] = useState(false);
    const [producteChecked, setProducteChecked] = useState(false);
    const [altresChecked, setAltresChecked] = useState(false)

    const [producteDisplay, setProducteDisplay] = useState('none');
    const [error, setError] = useState('');
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [resolutionDisplay, setResolutionDisplay] = useState('none');

    const [resolvedChecked, setResolvedChecked] = useState(false);
    const [unresolvedChecked, setUnresolvedChecked] = useState(true);
    const [pendingInfoChecked, setPendingInfoChecked] = useState(false);

    useEffect(() => {
        console.log(error)
    }, [error])


    useEffect(() => {
        onValue(incidenciesRef, (snapshot) => {
            const data = snapshot.val();
            let incidenciaTemp: Incidencia = {
                key: data.key ? data.key : '',
                ncNum: data.ncNum,
                //check if date is not undefined, if it is, set it to current date
                date: data.date,
                adminId: data.adminId,
                comandaType: data.comandaType,
                formaRegistre: data.formaRegistre,
                comandaNum: data.comandaNum,
                codiDistribuidor: data.codiDistribuidor,
                nomDistribuidor: data.nomDistribuidor,
                nomTrucador: data.nomTrucador,
                correuTrucador: data.correuTrucador,
                tlfTrucador: data.tlfTrucador,
                direccioClientFinal: data.direccioClientFinal,
                tlfClientFinal: data.tlfClientFinal,
                refProducte: data.refProducte,
                descrProducte: data.descrProducte,
                comentarisNC: data.comentarisNC,
                serveioproducte: data.serveioproducte,
                downloadURL: data.downloadURL,
                fileTitle: data.fileTitle,
                resolucio: data.resolucio || '',
                resolucioTimestamp: data.resolucioTimestamp || '',
                state: data.state,
            }
            setIncidencia(incidenciaTemp);

            const adminRef = ref(db, "/admins/" + incidenciaTemp.adminId);

            onValue(adminRef, (snapshot) => {
                const data = snapshot.val();
                setAdminName(data.name);
            });

            setAdminId(incidenciaTemp.adminId);
            setComandaType(incidenciaTemp.comandaType);
            setFormaRegistre(incidenciaTemp.formaRegistre);

            if (incidenciaTemp.date) {
                setDate(dayjs(parseInt(incidenciaTemp.date)));
                setTimestamp(incidenciaTemp.date);
            }

            setNcNum(incidenciaTemp.ncNum);
            setComandaNum(incidenciaTemp.comandaNum);
            setCodiDistribuidor(incidenciaTemp.codiDistribuidor);
            setNomDistribuidor(incidenciaTemp.nomDistribuidor);
            setNomTrucador(incidenciaTemp.nomTrucador);
            setCorreuTrucador(incidenciaTemp.correuTrucador);
            setTlfTrucador(incidenciaTemp.tlfTrucador);
            setDireccioClientFinal(incidenciaTemp.direccioClientFinal);
            setTlfClientFinal(incidenciaTemp.tlfClientFinal);
            setComentarisNC(incidenciaTemp.comentarisNC);
            setServeiChecked(incidenciaTemp.serveioproducte === 'servei');
            setProducteChecked(incidenciaTemp.serveioproducte === 'producte');
            setState(incidenciaTemp.state);
            setResolution(incidenciaTemp.resolucio);

            if (incidenciaTemp.resolucioTimestamp) {
                setResolutionDate(dayjs(parseInt(incidenciaTemp.resolucioTimestamp)));
                setResolutionTimestamp(incidenciaTemp.resolucioTimestamp);
            }


            setResolvedChecked(incidenciaTemp.state === 'resolta');
            setUnresolvedChecked(incidenciaTemp.state === 'pendent');
            setPendingInfoChecked(incidenciaTemp.state === 'pendentinfo');

            if (incidenciaTemp.serveioproducte === 'producte') {
                setProducteDisplay('');
                setRefProducte(incidenciaTemp.refProducte);
                setDescrProducte(incidenciaTemp.descrProducte);
            } else {
                setProducteDisplay('none');
            }

            if (incidenciaTemp.downloadURL !== '') {
                setFileTitle(incidenciaTemp.fileTitle);
                setDownloadURL(incidenciaTemp.downloadURL)
            }


        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);






    const handleFormaRegistreSelectChange = (event: SelectChangeEvent) => {
        setFormaRegistre(event.target.value as string);
    };
    const handleComandaTypeSelectChange = (event: SelectChangeEvent) => {
        setComandaType(event.target.value as string);
    };
    const handleRegistradorSelectChange = (event: SelectChangeEvent) => {
        setAdminId(event.target.value as string);

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

    const handleDeleteFileDialogClose = () => {
        setOpenDeleteAlert(false);
    };

    const handleDeleteFileCancel = () => {
        setOpenDeleteAlert(false);
    }

    const handleDeleteFileAgree = () => {
        setOpenDeleteAlert(false);
        deleteFile()
    }


    const [fileTitle, setFileTitle] = useState('');
    const [file, setFile] = useState<File | null | undefined>(null);
    const [ncNum, setNcNum] = useState(0);


    const inputFileRef = useRef<HTMLInputElement>(null);
    const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        let fileInput = e.target.files?.item(0);
        setFile(fileInput);
        setFileTitle(fileInput?.name || '');
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




    const navigate = useNavigate();


    async function editIncidencia() {


        //get realtime database ref and push

        try {

            try {
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
                //get firebaseStorage from firebase
                const storage = getStorage(firebaseApp);

                //upload the file to storage, no matter if imports are not specified
                var storageRef: any;
                try {
                    storageRef = refStorage(storage, 'incidencies/inconformitats/' + fileTitle);
                } catch (error) {
                    console.log(error);
                }
                if (file === null || file === undefined) {
                    try {
                        const dbRef = ref(db, 'incidencies/inconformitats/' + incidenciaKey);


                        let downloadURLTemp: string = '';
                        let fileTitleTemp: string = '';
                        let state = '';
                        if (resolvedChecked) {
                            state = 'resolta';
                        } else if (unresolvedChecked) {
                            state = 'pendent';
                        } else if (pendingInfoChecked) {
                            state = 'pendentinfo';
                        }
                        downloadURL !== '' ? downloadURLTemp = downloadURL : downloadURLTemp = '';
                        fileTitle !== '' ? fileTitleTemp = fileTitle : fileTitleTemp = '';
                        const incidencia: Incidencia = {
                            key: incidenciaKey,
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
                            serveioproducte: serveioproducte,
                            downloadURL: downloadURLTemp,
                            fileTitle: fileTitleTemp,
                            resolucio: resolution || '',
                            resolucioTimestamp: resolutionTimestamp || '',
                            state: state,
                        };
                        await set(dbRef, incidencia);





                    } catch (error: any) {
                        alert("error: " + error.message);
                    }
                } else {
                    await uploadBytesResumable(storageRef, file as Blob).then((snapshot) => {
                        console.log('Uploaded a blob or file!');

                        //get download url
                        getDownloadURL(snapshot.ref).then((downloadURL) => {

                            try {
                                const dbRef = ref(db, 'incidencies/inconformitats/' + incidenciaKey);

                                if (dbRef) {

                                    const incidencia: Incidencia = {
                                        key: incidenciaKey,
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
                                        serveioproducte: serveioproducte,
                                        downloadURL: downloadURL,
                                        fileTitle: fileTitle,
                                        resolucio: resolution || '',
                                        resolucioTimestamp: resolutionTimestamp || '',
                                        state: state,
                                    };
                                    set(dbRef, incidencia);

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


        updateFile();
        //navigate to transport page
        console.log("Edited incidencia")
        navigate('/incidencies');

    }
    function beginDeleteFile(): void {
        setOpenDeleteAlert(true)

    }
    function updateFile() {
        if (downloadURL !== '') {

            try {
                let storageRefFromDownloadURL = refStorage(storage, downloadURL);
                deleteObject(storageRefFromDownloadURL).then(() => {
                    console.log("updated file")
                });
            } catch (error) {
                console.log("error deleting: " + error)
            }

        }
    }

    function deleteFile() {
        if (downloadURL !== '') {

            try {
                let storageRefFromDownloadURL = refStorage(storage, downloadURL);
                deleteObject(storageRefFromDownloadURL).then(() => {
                    console.log("deleted")
                    setFileTitle('');
                    setFile(null);
                    setDownloadURL('');
                    //update downloadURL and fileTitle in database
                    const dbRef = ref(db, 'incidencies/inconformitats/' + incidenciaKey);
                    if (incidencia) {
                        incidencia.downloadURL = '';
                        incidencia.fileTitle = '';
                        set(dbRef, incidencia);
                    }
                    alert("Arxiu eliminat correctament")


                });
            } catch (error) {
                console.log("error deleting: " + error)
            }

        } else {
            setFileTitle('');
            setFile(null);
            setDownloadURL('');
        }
    }

    function startSendEmail(type: string): void {
        let mailBody;
        let mailSubject;

        switch (type) {
            case 'askInfo':
                //send mail to correuTrucador
                mailBody = "Estimado cliente, le confirmamos que su notificación con referencia NC" + ncNum + " ha sido parcialmente registrada por falta de información. Información solicitada:\n\n    · (PARA RELLENAR POR EL USUARIO)\n\ny nos mantenemos a la espera de recibir documentación por su parte.\nAgradeceríamos que pudiera responder este email con la información solicitada.\n\nMuy atentamente,\n" + adminName;
                mailSubject = `Notificación NC${ncNum} registrada`;
                //mail to correuTrucador
                sendEmail(correuTrucador, mailSubject, mailBody);
                break;
            case 'sendData':
                //send mail to correuTrucador
                mailBody = "Estimado cliente, le confirmamos que su notificación con referencia NC" + ncNum + " ha sido correctamente registrada y que en un plazo de 24-48 horas recibirá una respuesta al respecto.\n\nMuy atentamente,\n" + adminName;
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

    return (
        <div>
            <Navbar />
            <input type='file' name='file' id='file' ref={inputFileRef} onChangeCapture={onFileChangeCapture}
                style={{ display: 'none' }}
                accept="*"
                multiple={false} />
            <h1>Editar no conformitat</h1>
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
                    {/*Descr. product*/}
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
                    <h6 style={{ marginTop: "10px" }}>Altres:</h6>
                    <Checkbox
                        checked={altresChecked}
                        onChange={handleAltresCheck}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Stack>
            {/*comentaris*/}
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
                <Stack spacing={1} direction="row">
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

            <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "30px" }} className="StackCheck" spacing={1} direction="column">
                <Button sx={{ width: 'min-content' }} onClick={inputFileClick} variant="contained">{fileTitle !== '' ? fileTitle : 'SENSE ARXIU'}</Button>
                {downloadURL !== "" || fileTitle !== '' ? <a href={`${downloadURL}`} rel="noreferrer" target="_blank">{fileTitle}</a> : <p>No hi ha fitxer adjunt</p>}
                {downloadURL !== "" || fileTitle !== '' ? <Button sx={{ width: 'min-content' }} onClick={() => beginDeleteFile()} variant="contained">Eliminar fitxer</Button> : null}
                {/*Input for document*/}
            </Stack>
            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                {pendingInfoChecked &&
                    <Button onClick={() => startSendEmail("askInfo")} variant="contained">ENVIAR MAIL<br />SOL·LICITUT DADES</Button>}
            </Stack>
            <Stack style={{ margin: "30px" }} className="StackCheck" spacing={1} direction="row">
                <Button onClick={() => editIncidencia()} variant="contained">EDITAR NO CONFORMITAT</Button>
            </Stack>

            <Dialog
                open={openDeleteAlert}
                onClose={handleDeleteFileDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Estás segur/a que vols eliminar aquesta no conformitat?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        En el·liminar, s'el·liminarà l'arxiu de la base de dades.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteFileCancel}>CANCEL·LAR</Button>
                    <Button onClick={handleDeleteFileAgree} autoFocus>
                        ELIMINAR ARXIU
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );

}

export default EditInconformitat;