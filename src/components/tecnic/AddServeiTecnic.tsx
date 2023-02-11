import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";
import { ServeiTecnic, TecnicData } from "../../types";
import { getDatabase, onValue, push, ref as databaseRef, set } from "firebase/database";


const AddServeiTecnic = () => {

    const navigate = useNavigate();
    const storage = getStorage(firebaseApp);
    const db = getDatabase(firebaseApp);
    //storageRef
    const serveiTecnicRef = databaseRef(db, 'serveiTecnic/');
    const tecnicsRef = databaseRef(db, 'tecnics/');

    const [tecnicId, setTecnicId] = useState('');
    const [tecnicName, setTecnicName] = useState('');
    const [tecnicsList, setTecnicsList] = useState<TecnicData[]>([]);


    //create currentDate for datetime-local input
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 16));
    const [codeDistributor, setCodeDistributor] = useState('');
    const [nameDistributor, setNameDistributor] = useState('');
    const [emailDistributor, setEmailDistributor] = useState('');
    const [albaraType, setAlbaraType] = useState('');
    const [albaraNumber, setAlbaraNumber] = useState('');
    const [isMesura, setIsMesura] = useState(true);
    const [description, setDescription] = useState('');
    const [finalClientName, setFinalClientName] = useState('');
    const [finalClientPhone, setFinalClientPhone] = useState('');
    const [finalClientAddress, setFinalClientAddress] = useState('');
    //typed useState for albaraFile for a single file input
    const [albaraFile, setAlbaraFile] = useState<File | null>(null);
    //typed useState for documents for a multiple file input
    const [documents, setDocuments] = useState<FileList | null>(null);

    const [actionDate, setActionDate] = useState('');



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
        var albaraUrl;
        var documentsUrl = [];
        const currentDateTimestamp = new Date(currentDate).getTime();
        const actionDateTimestamp = new Date(actionDate).getTime();

        if (albaraFile) {
            const albaraRef = storageRef(storage, `albarans/${albaraFile.name}`);
            await uploadBytes(albaraRef, albaraFile);
            albaraUrl = await getDownloadURL(albaraRef);
        }
        if (documents) {
            for (let i = 0; i < documents.length; i++) {
                const documentsRef = storageRef(storage, `documents/${documents[i].name}`);
                await uploadBytes(documentsRef, documents[i]);
                documentsUrl.push(await getDownloadURL(documentsRef));
            }
        }

        const newServeiTecnicRef = push(serveiTecnicRef);

        const key = newServeiTecnicRef.key;


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
            albaraFile: albaraUrl || '',
            documents: documentsUrl,
            actionDate: actionDateTimestamp|| 0,
        }

        set(newServeiTecnicRef, serveiTecnic);

        navigate('/tecnic/', { state: { message: 'Servei tècnic afegit correctament.' } });


    }

    const handleCheckbox = () => {
        setIsMesura(!isMesura);
        const uploadAlbara = document.querySelector(".uploadAlbara");
        if (uploadAlbara) {
            uploadAlbara.classList.toggle("collapse");
        }
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
                    <select className="form-control selectedTecnic" id="deployableList" onChange={(e) => handleSelectTecnic(e.target.value)}>
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
                    <label className="form-check-label" htmlFor="installation">Instal·lació</label>
                    <input checked={!isMesura} onChange={() => handleCheckbox()} type="checkbox" className="mx-2 form-check-input" id="measureTaking" />
                    <label className="form-check-label" htmlFor="measureTaking">Presa mesures</label>
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
                <div className="form-group">
                    <label htmlFor="documentsInput">Documents: </label><br />
                    <input type="file" multiple className="form-control-file" id="documentsInput" onChange={(e) => setDocuments(e.target.files)} />
                </div>
                <div className="form-group">
                    <label htmlFor="actionDate">Data d'acció prevista:</label>
                    <input type="datetime-local" value={actionDate} onChange={(e) => setActionDate(e.target.value)} className="form-control" id="actionDate" />
                </div>
                <button onClick={() => addServeiTecnic()} className="btn btn-primary">Crear servei tècnic</button>
            </form>

        </div>
    );



}

export default AddServeiTecnic;