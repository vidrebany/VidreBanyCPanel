import { useEffect, useState } from "react";
import { Incidencia } from "../../types";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import "./styles/IncidenciesObertes.css"
import { getStorage, ref as refStorage, deleteObject } from "firebase/storage";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import dayjs from 'dayjs';


const InconformitatsTancades = () => {
    const navigate = useNavigate();

    //firebase database
    const db = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    //incidenciesRef
    const incidenciesRef = ref(db, "/incidencies/inconformitats");

    //incidencia list useState that has a list of Incidencia[] objects
    const [inconformitatsList, setInconformitatsList] = useState<Incidencia[]>([]);



    //get incidencies list
    useEffect(() => {
        onValue(incidenciesRef, (snapshot) => {
            const data = snapshot.val();

            let inconformitatsListTemp: Incidencia[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key].state === "resolta") {


                        let incidencia: Incidencia = {
                            key: data[key].key,
                            ncNum: data[key].ncNum,
                            date: data[key].date || '',
                            adminId: data[key].adminId,
                            comandaType: data[key].comandaType,
                            formaRegistre: data[key].formaRegistre,
                            comandaNum: data[key].comandaNum,
                            codiDistribuidor: data[key].codiDistribuidor,
                            nomDistribuidor: data[key].nomDistribuidor,
                            correuDistribuidor: data[key].correuDistribuidor,
                            nomTrucador: data[key].nomTrucador,
                            correuTrucador: data[key].correuTrucador,
                            tlfTrucador: data[key].tlfTrucador,
                            direccioClientFinal: data[key].direccioClientFinal,
                            tlfClientFinal: data[key].tlfClientFinal,
                            refProducte: data[key].refProducte,
                            descrProducte: data[key].descrProducte,
                            comentarisNC: data[key].comentarisNC,
                            serveioproducte: data[key].serveioproducte,
                            downloadURL: data[key].downloadURL,
                            fileTitle: data[key].fileTitle,
                            resolucio: data[key].resolucio || '',
                            state: data[key].state,
                        }
                        inconformitatsListTemp.push(incidencia);
                    }
                }
            }




            setInconformitatsList(inconformitatsListTemp);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [incidenciaDeleteKey, setIncidenciaDeleteKey] = useState('');
    const [incidenciaDeleteDownloadURL, setIncidenciaDeleteDownloadURL] = useState('');


    const handleDeleteDialogClose = () => {
        setOpenDeleteAlert(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteAlert(false);
    }

    const handleDeleteAgree = () => {
        setOpenDeleteAlert(false);
        deleteIncidencia(incidenciaDeleteKey, incidenciaDeleteDownloadURL);
    }

    function deleteIncidencia(incidenciaDeleteKey: string, incidenciaDeleteDownloadURL: string) {

        const dbRef = ref(db, '/incidencies/inconformitats/' + incidenciaDeleteKey);

        if (incidenciaDeleteDownloadURL !== "") {
            try {
                let storageRefFromDownloadURL = refStorage(storage, incidenciaDeleteDownloadURL);
                deleteObject(storageRefFromDownloadURL).then(() => {
                    console.log("deleted")
                    remove(dbRef);
                });
            } catch (error) {
                console.log("error deleting: " + error)
            }
        } else {
            remove(dbRef);
        }

    }








    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <Navbar />
            <div>
                <h1 style={{ textAlign: 'center' }}>No conformitats</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Llista no conformitats resoltes</h3>
            <Stack spacing={2} direction="row">
                <Button onClick={() => navigate('/incidencies')} variant="contained">Tornar</Button>
                <Button onClick={() => navigate('/addincidencia')} variant="contained">Nova no conformitat</Button>
            </Stack>

            {/*Map inconformitatsList in case it's not null*/}
            {inconformitatsList && inconformitatsList.map((incidencia) => {
                function beginDeleteIncidencia(incidenciaKey: string, incidenciaDownloadURL: string): void {
                    setOpenDeleteAlert(true)
                    setIncidenciaDeleteKey(incidenciaKey);
                    setIncidenciaDeleteDownloadURL(incidenciaDownloadURL);

                }

                return (
                    <div key={incidencia.key} style={{ whiteSpace: 'pre-wrap' }} className="listView">
                        <div className="listItem">
                            <div className="listItemContent">
                                <div className="listItemContentLeft">
                                    <Stack sx={{justifyContent: 'center'}} spacing={2} direction="row">
                                        <h4>NC: {incidencia.ncNum}</h4>
                                        <h4>{dayjs(parseInt(incidencia.date)).format("DD/MM/YYYY - HH:mm").toString()}</h4>
                                    </Stack>
                                    <Stack spacing={1} direction="column">
                                        <Stack spacing={1} direction="row">
                                            <Stack spacing={2 } direction="column">
                                                <p><b>Tipus: </b>{incidencia.serveioproducte}</p>
                                                <p><b>{incidencia.comandaType}:</b> {incidencia.comandaNum}</p>



                                            </Stack>
                                            <Stack spacing={2} direction="column">
                                                <p><b>Codi distribuïdor: </b>{incidencia.codiDistribuidor}</p>
                                                <p><b>Nom distribuïdor: </b>{incidencia.nomDistribuidor}</p>



                                            </Stack>
                                        </Stack>

                                        <p><b>Comentaris: </b>{"\n" + incidencia.comentarisNC}</p>
                                        {incidencia.state !== "pendent" ? <p><b>Resolució: </b>{"\n" + incidencia.resolucio}</p> : <p></p>}
                                        {incidencia.downloadURL !== "" ? <a href={`${incidencia.downloadURL}`} rel="noreferrer" target="_blank">{incidencia.fileTitle}</a> : <p>No hi ha fitxer adjunt</p>}



                                    </Stack>
                                </div>


                                <div className="listItemContentRight">
                                    <button onClick={() => navigate(`/editinconformitat/`, { state: { incidenciaKey: incidencia.key } })}>Editar</button>
                                    <button onClick={() => beginDeleteIncidencia(incidencia.key, incidencia.downloadURL)}>Eliminar</button>
                                    <button onClick={() => navigate(`/viewtransportorder/${incidencia.key}`)}>Veure</button>
                                </div>
                            </div>
                        </div>
                    </div>

                );
            })}

            <Dialog
                open={openDeleteAlert}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Estás segur/a que vols eliminar aquesta no conformitat?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        En eliminar aquesta no conformitat, tots els seus registres i arxius es perdran.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>CANCEL·LAR</Button>
                    <Button onClick={handleDeleteAgree} autoFocus>
                        ELIMINAR
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default InconformitatsTancades;


