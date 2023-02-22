import { deleteObject, getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";
import { ServeiTecnic, TecnicData } from "../../types";
import { getDatabase, onValue, push, ref as databaseRef, set, update } from "firebase/database";


const AddServeiTecnic = () => {

    const navigate = useNavigate();
    const storage = getStorage(firebaseApp);
    const location = useLocation();


    const serveiTecnicLocation: ServeiTecnic = location.state.serveiTecnic;
    const btnTitle = location.state.btnTitle;
    const alertMessage = location.state.alertMessage;


    const db = getDatabase(firebaseApp);

    //storageRef
    const tecnicsRef = databaseRef(db, 'tecnics/');
    const [tecnicId, setTecnicId] = useState('');
    const [tecnicName, setTecnicName] = useState('');
    const [tecnicsList, setTecnicsList] = useState<TecnicData[]>([]);


    //create currentDate for datetime-local input
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 16));
    const [codeDistributor, setCodeDistributor] = useState('');
    const [nameDistributor, setNameDistributor] = useState('');
    const [emailDistributor, setEmailDistributor] = useState('');
    const [albaraType, setAlbaraType] = useState('Albaran');
    const [albaraNumber, setAlbaraNumber] = useState('');
    const [isMesura, setIsMesura] = useState(true);
    const [description, setDescription] = useState('');
    const [finalClientName, setFinalClientName] = useState('');
    const [finalClientPhone, setFinalClientPhone] = useState('');
    const [finalClientAddress, setFinalClientAddress] = useState('');
    //typed useState for albaraFile for a single file input
    const [albaraFile, setAlbaraFile] = useState<File | null>(null);
    const [albaraFileName, setAlbaraFileName] = useState('');
    const [albaraFileUrl, setAlbaraFileUrl] = useState('');
    //typed useState for documents for a multiple file input
    const [documents, setDocuments] = useState<FileList | null>(null);
    const [documentsNames, setDocumentsNames] = useState<string[]>([]);
    const [documentsUrls, setDocumentsUrls] = useState<string[]>([]);
    const [actionDate, setActionDate] = useState('');
    const [stateServei, setStateServei] = useState('Pendent');


    useEffect(() => {
        if (serveiTecnicLocation) {

            //parse serveiTecnic.currentDate to datetime-local input
            const date = new Date(serveiTecnicLocation.currentDate);
            const currentDateISO = date.toISOString().slice(0, 16);
            if (currentDateISO) {
                setCurrentDate(currentDateISO);
            }
            //parse serveiTecnic.actionDate to datetime-local input
            if (serveiTecnicLocation.actionDate) {
                const dateAction = new Date(serveiTecnicLocation.actionDate);
                const actionDateISO = dateAction.toISOString().slice(0, 16);
                setActionDate(actionDateISO);
            }
            //get file name from storage using albaraFile url
            if (serveiTecnicLocation.albaraFile) {
                setAlbaraFileName(serveiTecnicLocation.albaraFileName);
            }
            //get file names from storage using documents url
            if (serveiTecnicLocation.documents) {
                let documentsNamesTemp: string[] = [];
                for (let i = 0; i < serveiTecnicLocation.documentsNames.length; i++) {
                    const documentName = serveiTecnicLocation.documentsNames[i];
                    documentsNamesTemp.push(documentName);
                }
                setDocumentsNames(documentsNamesTemp);
            }

            setTecnicId(serveiTecnicLocation.tecnicId);
            setTecnicName(serveiTecnicLocation.tecnicName);
            setCodeDistributor(serveiTecnicLocation.codeDistributor);
            setNameDistributor(serveiTecnicLocation.nameDistributor);
            setEmailDistributor(serveiTecnicLocation.emailDistributor);
            setAlbaraType(serveiTecnicLocation.albaraType);
            setAlbaraNumber(serveiTecnicLocation.albaraNumber);
            setIsMesura(serveiTecnicLocation.isMesura);
            setDescription(serveiTecnicLocation.description);
            setFinalClientName(serveiTecnicLocation.finalClientName);
            setFinalClientPhone(serveiTecnicLocation.finalClientPhone);
            setFinalClientAddress(serveiTecnicLocation.finalClientAddress);
            setAlbaraFileUrl(serveiTecnicLocation.albaraFile);
            setDocumentsUrls(serveiTecnicLocation.documents || []);
            setStateServei(serveiTecnicLocation.stateServei);
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serveiTecnicLocation])


    //get tecnics list
    useEffect(() => {
        onValue(tecnicsRef, (snapshot) => {
            const data = snapshot.val();

            let tecnicsListTemp: TecnicData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let tecnicData: TecnicData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    tecnicsListTemp.push(tecnicData);
                }
            }



            setTecnicsList(tecnicsListTemp);





        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSelectTecnic(value: string) {
        setTecnicId(value);
        const form = document.querySelector('.selectedTecnic') as HTMLFormElement;
        const selectedOption = form.options[form.selectedIndex];
        const tecnicName = selectedOption.text;
        setTecnicName(tecnicName);
    }

    async function addServeiTecnic() {
        const currentDateTimestamp = new Date(currentDate).getTime() + 60 * 60 * 1000;
        const actionDateTimestamp = new Date(actionDate).getTime() + 60 * 60 * 1000;
        var albaraFileUrlTemp = albaraFileUrl;
        var albaraFileNameTemp = albaraFileName;

        if (albaraFile) {
            const albaraRef = storageRef(storage, `albarans/${currentDateTimestamp + albaraFile.name}`);
            await uploadBytes(albaraRef, albaraFile);
            albaraFileUrlTemp = await getDownloadURL(albaraRef);
            albaraFileNameTemp = albaraFile.name;
            setAlbaraFileUrl(albaraFileUrlTemp);
            setAlbaraFileName(albaraFile.name);

            if (albaraFileUrl !== '') {
                try {
                    let storageRefFromDownloadURL = storageRef(storage, albaraFileUrl);
                    deleteObject(storageRefFromDownloadURL).then(() => {
                        console.log("deleted albara")
                    });
                } catch (error) {
                    console.log("error deleting: " + error)
                }
            }
        }

        if (documents) {
            var documentsUrlsTemp = documentsUrls;
            var documentsNamesTemp = documentsNames;
            for (let i = 0; i < documents.length; i++) {
                const documentsRef = storageRef(storage, `documents/${currentDateTimestamp + documents[i].name}`);
                await uploadBytes(documentsRef, documents[i]);
                const documentUrl = await getDownloadURL(documentsRef);
                documentsUrlsTemp.push(documentUrl);
                documentsNamesTemp.push(documents[i].name);
            }
            setDocumentsUrls(documentsUrlsTemp);
            setDocumentsNames(documentsNamesTemp);
        }

        var key;
        var serveiTecnicRef;

        if (serveiTecnicLocation) {
            key = serveiTecnicLocation.key;
            serveiTecnicRef = databaseRef(db, `serveiTecnic/${key}`);
        } else {
            //push to get new key
            serveiTecnicRef = push(databaseRef(db, 'serveiTecnic'));
            key = serveiTecnicRef.key;
        }




        const serveiTecnic: ServeiTecnic = {
            key: key || '',
            tecnicId: tecnicId,
            tecnicName: tecnicName,
            currentDate: currentDateTimestamp,
            codeDistributor: codeDistributor,
            nameDistributor: nameDistributor,
            emailDistributor: emailDistributor,
            albaraType: albaraType,
            albaraNumber: albaraNumber,
            isMesura: isMesura,
            description: description,
            finalClientName: finalClientName,
            finalClientPhone: finalClientPhone,
            finalClientAddress: finalClientAddress,
            albaraFile: albaraFileUrlTemp || '',
            albaraFileName: albaraFileNameTemp,
            documents: documentsUrls || [],
            documentsNames: documentsNames,
            actionDate: actionDateTimestamp || 0,
            stateServei: stateServei,
        }

        set(serveiTecnicRef, serveiTecnic);

        navigate('/tecnic/', { state: { message: alertMessage } });


    }

    const handleCheckbox = () => {
        setIsMesura(!isMesura);
        const uploadAlbara = document.querySelector(".uploadAlbara");
        if (uploadAlbara) {
            uploadAlbara.classList.toggle("collapse");
        }
    }

    async function deleteAlbara(albaraFileUrl: string) {
        const albaraRef = storageRef(storage, albaraFileUrl);
        await deleteObject(albaraRef);
        setAlbaraFileUrl('');
        setAlbaraFileName('');

        await update(databaseRef(db, `serveiTecnic/${serveiTecnicLocation.key}`), {
            albaraFile: '',
            albaraFileName: '',
        });
    }

    function deleteDocument(documentIndex: number) {

        console.log(documentsUrls)

        const documentsUrlsTemp = documentsUrls;
        const documentsNamesTemp = documentsNames;




        const documentRef = storageRef(storage, documentsUrlsTemp[documentIndex]);

        try {
            deleteObject(documentRef).then(() => {
                console.log("deleted document")
            });
        } catch (error) {
            console.log("error deleting: " + error)
        }

        documentsUrlsTemp.splice(documentIndex, 1);
        documentsNamesTemp.splice(documentIndex, 1);

        setDocumentsUrls(documentsUrlsTemp);
        setDocumentsNames(documentsNamesTemp);



        update(databaseRef(db, `serveiTecnic/${serveiTecnicLocation.key}`), {
            documents: documentsUrlsTemp,
            documentsNames: documentsNamesTemp,
        })


        location.state.message = alertMessage;

    }

    return (
        <div className="container">
            <Navbar />
            <h1>Afegir servei tècnic</h1>
            <div className="w-100 d-flex justify-content-start">
                <button type="button" className="btn btn-primary" onClick={() => navigate('/tecnic')}>Tornar</button>
            </div>

            <form>
                <div className="form-group">
                    <label htmlFor="deployableList">Tècnic encarregat del servei:</label>
                    <select value={tecnicId} className="form-control selectedTecnic" id="deployableList" onChange={(e) => handleSelectTecnic(e.target.value)}>
                        <option value="">Selecciona un tècnic</option>
                        {tecnicsList.map((tecnic) => {
                            return (
                                <option key={tecnic.id} value={tecnic.id}>{tecnic.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="currentDate">Data actual:</label>
                    <input type="datetime-local" onChange={(e) => setCurrentDate(e.target.value)} value={currentDate} className="form-control" id="currentDate" />
                </div>
                <div className="form-group">
                    <label htmlFor="distributorCode">Codi Client Distribuïdor:</label>
                    <input type="number" value={codeDistributor} onChange={(e) => setCodeDistributor(e.target.value)} className="form-control validate number-validation" placeholder="01234" pattern="[0-9]+" id="distributorCode" />
                </div>
                <div className="form-group">
                    <label htmlFor="distributorName">Nom Client Distribuïdor:</label>
                    <input type="text" value={nameDistributor} onChange={(e) => setNameDistributor(e.target.value)} className="form-control" id="distributorName" />
                </div>
                <div className="form-group">
                    <label htmlFor="distributorEmail">Email Client Distribuïdor:</label>
                    <input type="email" value={emailDistributor} onChange={(e) => setEmailDistributor(e.target.value)} className="form-control" id="distributorEmail" />
                </div>
                <div className="form-group">
                    <label htmlFor="deployableList">Tipus Document:</label>
                    <select value={albaraType} onChange={(e) => setAlbaraType(e.target.value)} className="form-control" id="deployableList">
                        <option>Albaran</option>
                        <option>Pedido</option>
                        <option>Pedido Cliente</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="numberInput">Nº Document:</label>
                    <input type="number" value={albaraNumber} onChange={(e) => setAlbaraNumber(e.target.value)} placeholder="01234" className="form-control" id="numberInput" />
                </div>
                <div className="form-group form-check w-auto m-2 d-flex justify-space-between">
                    <input checked={isMesura} onChange={() => handleCheckbox()} type="checkbox" className="form-check-input mx-2" id="installation" />
                    <label className="form-check-label" htmlFor="installation">Presa de mesures</label>
                    <input checked={!isMesura} onChange={() => handleCheckbox()} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                    <label className="form-check-label" htmlFor="measureTaking">Instal·lació</label>
                </div>
                <div className="form-group">
                    <label htmlFor="descriptionText">Descripció:</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} id="descriptionText"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="finalClientName">Nom Client Final:</label>
                    <input type="text" value={finalClientName} onChange={(e) => setFinalClientName(e.target.value)} className="form-control" id="finalClientName" />
                </div>
                <div className="form-group">
                    <label htmlFor="finalClientPhone">Telèfon Client Final:</label>
                    <input type="text" value={finalClientPhone} onChange={(e) => setFinalClientPhone(e.target.value)} className="form-control" id="finalClientPhone" />
                </div>
                <div className="form-group">
                    <label htmlFor="finalClientAddress">Direcció Client Final:</label>
                    <input type="text" value={finalClientAddress} onChange={(e) => setFinalClientAddress(e.target.value)} className="form-control" id="finalClientAddress" />
                </div>
                <div className="form-group uploadAlbara">
                    <label htmlFor="documentsInput">Adjuntar albarà: </label><br />
                    <input type="file" className="form-control-file" id="documentsInput" onChange={(e) => setAlbaraFile(e.target.files?.item(0) || null)} />
                </div>
                {/*Display albaraFileName text*/}
                {albaraFileName && <div className="form-group">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <a href={albaraFileUrl} target="_blank" rel="noreferrer">{albaraFileName}</a>
                                <button onClick={() => deleteAlbara(albaraFileUrl)} className="btn btn-danger btn-sm float-right">Eliminar</button>
                            </div>
                        </li>
                    </ul>
                </div>}


                <div className="form-group">
                    <label htmlFor="documentsInput">Documents: </label><br />
                    <input type="file" multiple className="form-control-file" id="documentsInput" onChange={(e) => setDocuments(e.target.files)} />
                </div>
                {/*Display documentsNames list*/}
                {documentsUrls.length > 0 && <div className="form-group">
                    <label htmlFor="documentsNames">Noms dels documents: </label><br />
                    <ul className="list-group">
                        {documentsNames.map((documentName, index) => {
                            return (
                                <li key={index} className="list-group-item">
                                    {/*create a link to documentsUrls[index] and a delete button with onclick action*/}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <a href={documentsUrls[index]} target="_blank" rel="noreferrer">{documentName}</a>
                                        <button onClick={() => deleteDocument(index)} className="btn btn-danger btn-sm float-right">Eliminar</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>}
                <div className="form-group">
                    <label htmlFor="actionDate">Data d'acció prevista:</label>
                    <input type="datetime-local" value={actionDate} onChange={(e) => setActionDate(e.target.value)} className="form-control" id="actionDate" />
                </div>
                {/*Create a dropdown that has the options: "Finalitzat, Pendent, Per revisar"*/}
                <div className="form-group">
                    <label htmlFor="status">Estat:</label>
                    <select value={stateServei} onChange={(e) => setStateServei(e.target.value)} className="form-control" id="status">
                        <option>Pendent</option>
                        <option>Per revisar</option>
                        <option>Finalitzat</option>
                    </select>
                </div>
                <button onClick={() => addServeiTecnic()} className="btn btn-primary m-5">{btnTitle}</button>
            </form>

        </div>
    );



}

export default AddServeiTecnic;