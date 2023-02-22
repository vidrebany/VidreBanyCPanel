import { ServeiTecnic } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

const ViewServeiTecnic = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const serveiTecnicLocation: ServeiTecnic = location.state.serveiTecnic;


    const [tecnicId, setTecnicId] = useState('');
    const [tecnicName, setTecnicName] = useState('');
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
    const [albaraFileName, setAlbaraFileName] = useState('');
    const [albaraFileUrl, setAlbaraFileUrl] = useState('');
    //typed useState for documents for a multiple file input
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
        } else {
            navigate("/tecnic");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serveiTecnicLocation]);




    return (
        <div className="container">
            <Navbar />
            {/*Display responsively all servei tecnic data*/}
            <h1>Dades servei tècnic</h1>
            <div className="w-100 d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-primary" onClick={() => navigate('/tecnic')}>Tornar</button>
                <h3><span className={stateServei === 'Pendent' ? 'badge bg-danger' : stateServei === 'Per revisar' ? 'badge bg-warning' : 'badge bg-success'}>{stateServei}</span></h3>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/tecnic/addserveitecnic", { state: { serveiTecnic: serveiTecnicLocation, btnTitle: 'Editar servei tècnic', alertMessage: 'Servei tècnic actualitzat correctament.' } })}>Editar</button>
            </div>
            <div className="col mb-5">
                <div className="row">
                    <h6>Tècnic</h6>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="tecnicId">Tècnic ID</label>
                            <input type="text" className="form-control" id="tecnicId" value={tecnicId} readOnly />
                            <small className="form-text text-muted">ID del tècnic assignat al servei.</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="tecnicName">Tècnic</label>
                            <input type="text" className="form-control" id="tecnicName" value={tecnicName} readOnly />
                            <small className="form-text text-muted">Nom del tècnic assignat al servei.</small>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h6>Dates</h6>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="currentDate">Data</label>
                            <input type="datetime-local" className="form-control" id="currentDate" value={currentDate} readOnly />
                            <small className="form-text text-muted">Data i hora de creació del servei.</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="currentDate">Data d'acció</label>
                            <input type="datetime-local" className="form-control" id="currentDate" value={actionDate} readOnly />
                            <small className="form-text text-muted">Data i hora d'acció del servei.</small>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h6>Distribuidor</h6>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="codeDistributor">Codi distribuidor</label>
                        <input type="text" className="form-control" id="codeDistributor" value={codeDistributor} readOnly />
                        <small className="form-text text-muted">Codi del distribuidor.</small>
                    </div>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="nameDistributor">Nom distribuidor</label>
                        <input type="text" className="form-control" id="nameDistributor" value={nameDistributor} readOnly />
                        <small className="form-text text-muted">Nom del distribuidor.</small>
                    </div>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="emailDistributor">Email distribuidor</label>
                        <input type="text" className="form-control" id="emailDistributor" value={emailDistributor} readOnly />
                        <small className="form-text text-muted">Email del distribuidor.</small>
                    </div>
                </div>
                <div className="row">
                    <h6>Client final</h6>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="finalClientName">Nom client final</label>
                        <input type="text" className="form-control" id="finalClientName" value={finalClientName} readOnly />
                        <small className="form-text text-muted">Nom del client final.</small>
                    </div>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="finalClientPhone">Telèfon client final</label>
                        <input type="text" className="form-control" id="finalClientPhone" value={finalClientPhone} readOnly />
                        <small className="form-text text-muted">Núm de telèfon client final.</small>
                    </div>
                    <div className="col-md-4 col-sm-12 form-group">
                        <label htmlFor="finalClientAddress">Adreça client final</label>
                        <input type="text" className="form-control" id="finalClientAddress" value={finalClientAddress} readOnly />
                        <small className="form-text text-muted">Direcció del client final.</small>
                    </div>
                </div>
                <div className="row">
                    <h6>Informació albarà</h6>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="albaraType">Tipus albara</label>
                            <input type="text" className="form-control" id="albaraType" value={albaraType} readOnly />
                            <small className="form-text text-muted">Tipus d'albara.</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="albaraNumber">Número albara</label>
                            <input type="text" className="form-control" id="albaraNumber" value={albaraNumber} readOnly />
                            <small className="form-text text-muted">Número d'albara.</small>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="isMesura">Tipus</label>
                    <input type="text" className="form-control" id="isMesura" value={isMesura ? 'Mesures' : 'Instal·lació'} readOnly />
                    <small className="form-text text-muted">Indica si el tipus de servei.</small>
                </div>
                {/*Text for description (it has to be multiple lines) */}
                <div className="form-group">
                    <label htmlFor="description">Descripció</label>
                    <textarea className="form-control" id="description" rows={3} value={description} readOnly></textarea>
                    <small className="form-text text-muted">Descripció del servei.</small>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h6>Document albarà:</h6>
                        {albaraFileName && <div className="form-group">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <a href={albaraFileUrl} target="_blank" rel="noreferrer">{albaraFileName}</a>
                                    </div>
                                </li>
                            </ul>
                        </div>}
                    </div>
                    <div className="col-md-6">
                        <h6>Documents aportats per administrador:</h6>
                        {documentsUrls.length > 0 && <div className="form-group">
                            <ul className="list-group">
                                {documentsNames.map((documentName, index) => {
                                    return (
                                        <li key={index} className="list-group-item">
                                            {/*create a link to documentsUrls[index] and a delete button with onclick action*/}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <a href={documentsUrls[index]} target="_blank" rel="noreferrer">{documentName}</a>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ViewServeiTecnic;