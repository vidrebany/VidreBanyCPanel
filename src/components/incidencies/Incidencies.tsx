import Navbar from "../Navbar";
import "./styles/Incidencies.css"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { List, ListItem, ListItemText, Typography } from '@mui/material';

import { Button, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { getStorage, ref as refStorage, deleteObject } from "firebase/storage";
import { Incidencia } from "../../types";
import firebaseApp from "../../firebase";
import dayjs from "dayjs";



const Incidencies = () => {



    const navigate = useNavigate();

    const [unresolvedChecked, setUnresolvedChecked] = useState(true);
    const [pendingInfoChecked, setPendingInfoChecked] = useState(false);
    const [resolvedChecked, setResolvedChecked] = useState(false);
    const [searchText, setSearchText] = useState("");



    //firebase database
    const db = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    //incidenciesRef
    const incidenciesRef = ref(db, "/incidencies/inconformitats");

    //incidencia list useState that has a list of Incidencia[] objects
    const [inconformitatsList, setInconformitatsList] = useState<Incidencia[]>([]);




    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [incidenciaDeleteKey, setIncidenciaDeleteKey] = useState('');

    const handleDeleteDialogClose = () => {
        setOpenDeleteAlert(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteAlert(false);
    }

    const handleDeleteAgree = () => {
        setOpenDeleteAlert(false);
        deleteIncidencia(incidenciaDeleteKey);
    }


    function deleteIncidencia(incidenciaDeleteKey: string) {

        const dbRef = ref(db, '/incidencies/inconformitats/' + incidenciaDeleteKey);

        //select from inconformitatsList the object with the key that matches the key of the object to delete
        const incidenciaToDelete = inconformitatsList.find((incidencia) => incidencia.key === incidenciaDeleteKey);

        if (incidenciaToDelete?.documents) {
            try {
                incidenciaToDelete.documents.forEach(document => {
                    let storageRefFromDownloadURL = refStorage(storage, document);
                    deleteObject(storageRefFromDownloadURL).then(() => {
                        console.log("deleted")
                    }).catch((error) => {
                        console.log("error deleting: " + error)
                    });
                });
                remove(dbRef);
            } catch (error) {
                console.log("error deleting: " + error)
            }
        } else {
            remove(dbRef);
        }
    }


    useEffect(() => {
        onValue(incidenciesRef, (snapshot) => {
            const data = snapshot.val();

            let inconformitatsListTemp: Incidencia[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {


                    let incidenciaData: Incidencia = data[key];

                    if (searchText !== "" &&
                        (incidenciaData.nomDistribuidor.toLowerCase().includes(searchText.toLowerCase()) ||
                            incidenciaData.codiDistribuidor.toLowerCase().includes(searchText.toLowerCase())) && filterIncidenciaType(incidenciaData)) {
                        inconformitatsListTemp.push(incidenciaData);
                    } else if (searchText === "" && filterIncidenciaType(incidenciaData)) {
                        inconformitatsListTemp.push(incidenciaData);
                    }


                }
            }
            //sort the list by date, most recent first (inconformitatsListTemp.date)
            inconformitatsListTemp.sort((a, b) => {
                return parseInt(b.date) - parseInt(a.date);
            });
            setInconformitatsList(inconformitatsListTemp);

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unresolvedChecked, pendingInfoChecked, resolvedChecked, searchText]);


    function filterIncidenciaType(incidenciaData: Incidencia) {
        if ((unresolvedChecked && !pendingInfoChecked && !resolvedChecked) ||
            (!unresolvedChecked && pendingInfoChecked && !resolvedChecked) ||
            (!unresolvedChecked && !pendingInfoChecked && resolvedChecked)) {

            if (unresolvedChecked && incidenciaData.state === "pendent") {
                return true;
            } else if (pendingInfoChecked && incidenciaData.state === "pendentinfo") {
                return true;
            } else if (resolvedChecked && incidenciaData.state === "resolta") {
                return true;
            }
        } else {
            return true;
        }
        return false;
    }

    //Pagination code
    const [currentIndexes, setCurrentIndexes] = useState({
        unresolved: 0,
        pendingInfo: 0,
        resolved: 0,
    });


    const handlePrev = () => {
        setCurrentIndexes((prevIndexes) => {
            const currentFilter = unresolvedChecked ? 'unresolved' : pendingInfoChecked ? 'pendingInfo' : 'resolved';
            return {
                ...prevIndexes,
                [currentFilter]: prevIndexes[currentFilter] > 0 ? prevIndexes[currentFilter] - 1 : prevIndexes[currentFilter],
            };
        });
    };

    const handleNext = () => {
        setCurrentIndexes((prevIndexes) => {
            const currentFilter = unresolvedChecked ? 'unresolved' : pendingInfoChecked ? 'pendingInfo' : 'resolved';
            return {
                ...prevIndexes,
                [currentFilter]: prevIndexes[currentFilter] < inconformitatsList.length - 1 ? prevIndexes[currentFilter] + 1 : prevIndexes[currentFilter],
            };
        });
    };

    function beginDeleteIncidencia(incidenciaKey: string): void {
        setOpenDeleteAlert(true)
        setIncidenciaDeleteKey(incidenciaKey);

    }

    const handleCheckbox = (e: string) => {
        // Assuming you want to reset the index to 0 when you check a box
        // and restore it when you uncheck and check again, you would:

        // Store the current index before changing the filters
        const newIndexState = { ...currentIndexes };

        //only one of the checkboxes can be checked at a time
        if (e === "unresolvedChecked") {
            setUnresolvedChecked(!unresolvedChecked);
            setPendingInfoChecked(false);
            setResolvedChecked(false);
            newIndexState.unresolved = unresolvedChecked ? 0 : currentIndexes.unresolved;
        } else if (e === "pendingInfoChecked") {
            setUnresolvedChecked(false);
            setPendingInfoChecked(!pendingInfoChecked);
            setResolvedChecked(false);
            newIndexState.pendingInfo = pendingInfoChecked ? 0 : currentIndexes.pendingInfo;
        } else if (e === "resolvedChecked") {
            setUnresolvedChecked(false);
            setPendingInfoChecked(false);
            setResolvedChecked(!resolvedChecked);
            newIndexState.resolved = resolvedChecked ? 0 : currentIndexes.resolved;
        }

        setCurrentIndexes(newIndexState);
    }

    const currentFilter = unresolvedChecked ? 'unresolved' : pendingInfoChecked ? 'pendingInfo' : 'resolved';
    const currentIndex = currentIndexes[currentFilter];


    return (
        <div className="container tecnic">
            <Navbar />
            <h1>No conformitats</h1>
            <Button onClick={() => navigate('/addincidencia')} variant="contained">Nova no conformitat</Button>
            <Stack spacing={4} className="w-50 my-3" direction="column">
                <input onChange={(e) => setSearchText(e.target.value)} type="text" className="form-control" placeholder="Buscar per nom o codi de distribuïdor" aria-label="Search" aria-describedby="basic-addon2" />

            </Stack>

            <div className="form-group form-check w-auto m-2 d-flex justify-space-between">
                <input checked={unresolvedChecked} value="unresolvedChecked" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="form-check-input mx-2" id="installation" />
                <label className="form-check-label" htmlFor="installation">Sense resoldre</label>
                <input checked={pendingInfoChecked} value="pendingInfoChecked" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                <label className="form-check-label" htmlFor="measureTaking">Pendents d'informació</label>
                <input checked={resolvedChecked} value="resolvedChecked" onChange={(e) => handleCheckbox(e.target.value)} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                <label className="form-check-label" htmlFor="measureTaking">Resoltes</label>
            </div>
            <div>
                <Button variant="contained" onClick={handlePrev} disabled={currentIndexes[currentFilter] === 0}>
                    Previ
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={currentIndex === inconformitatsList.length - 1}
                    sx={{ marginLeft: '8px' }}
                >
                    Següent
                </Button>
            </div>
            <p>
                Mostrant {currentIndexes[currentFilter] + 1} de {inconformitatsList.length} no conformitats
            </p>

            {/*Map inconformitatsList in case it's not null*/}
            {inconformitatsList[currentIndex] &&


                <div key={inconformitatsList[currentIndex].key} style={{ whiteSpace: 'pre-wrap' }} className="listView">
                    <div className="listItem">
                        <div className="listItemContent">
                            <div className="listItemContentLeft">
                                <Stack sx={{ justifyContent: 'center' }} spacing={2} direction="row">
                                    <h4>NC: {inconformitatsList[currentIndex].ncNum}</h4>
                                    <h4>{dayjs(parseInt(inconformitatsList[currentIndex].date)).format("DD/MM/YYYY - HH:mm").toString()}</h4>
                                </Stack>
                                <Stack spacing={1} direction="column">
                                    <Stack spacing={1} direction="row">
                                        <Stack spacing={2} direction="column">
                                            <p><b>Tipus: </b>{inconformitatsList[currentIndex].serveioproducte}</p>
                                            <p><b>{inconformitatsList[currentIndex].comandaType}:</b> {inconformitatsList[currentIndex].comandaNum}</p>

                                            {(inconformitatsList[currentIndex].comandaNovaType !== "" && inconformitatsList[currentIndex].comandaNovaType !== undefined) &&
                                                <div>
                                                    <p><b> {inconformitatsList[currentIndex].comandaNovaType} nou: </b>{inconformitatsList[currentIndex].comandaNovaNum}</p>
                                                </div>
                                            }



                                        </Stack>
                                        <Stack spacing={2} direction="column">
                                            <p><b>Codi distribuïdor: </b>{inconformitatsList[currentIndex].codiDistribuidor}</p>
                                            <p><b>Nom distribuïdor: </b>{inconformitatsList[currentIndex].nomDistribuidor}</p>



                                        </Stack>
                                    </Stack>

                                    <p><b>Comentaris inicials: </b>{"\n" + inconformitatsList[currentIndex].comentarisInicialsNC}</p>
                                    <p><b>Comentaris: </b>{"\n" + inconformitatsList[currentIndex].comentarisNC}</p>
                                    {inconformitatsList[currentIndex].state !== "pendent" ? <p><b>Resolució ({dayjs(parseInt(inconformitatsList[currentIndex].resolucioTimestamp)).format("DD/MM/YYYY - HH:mm").toString()}):</b>{"\n" + inconformitatsList[currentIndex].resolucio}</p> : <p></p>}
                                    <p>Nº arxius: {inconformitatsList[currentIndex].documents ? inconformitatsList[currentIndex].documents.length : 0} </p>



                                </Stack>
                            </div>


                            <div className="listItemContentRight">
                                <button onClick={() => navigate(`/editinconformitat/`, { state: { incidenciaKey: inconformitatsList[currentIndex].key } })}>Editar</button>
                                <button onClick={() => beginDeleteIncidencia(inconformitatsList[currentIndex].key)}>Eliminar</button>
                                {/*<button onClick={() => navigate(`/viewtransportorder/${inconformitatsList[currentIndex].key}`)}>Veure</button>*/}
                            </div>
                        </div>
                    </div>
                </div>
            }

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
        </div>
    );

}

export default Incidencies;