import { useNavigate } from "react-router-dom";


const AddServeiTecnic = () => {

    const navigate = useNavigate();

    return (
        <div className="container">
            <h1>Afegir servei tècnic</h1>
            <div className="w-100 d-flex justify-content-start">
                <button type="button" className="btn btn-primary" onClick={() => navigate('/tecnic')}>Tornar</button>
            </div>
            <form>
                <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input type="text" className="form-control" id="nom" placeholder="Nom" />
                </div>
                <div className="form-group">
                    <label htmlFor="cognom">Cognom</label>
                    <input type="text" className="form-control" id="cognom" placeholder="Cognom" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Email" />
                </div>
                <div className="form-group">
                    <label htmlFor="telefon">Telèfon</label>
                    <input type="text" className="form-control" id="telefon" placeholder="Telèfon" />
                </div>
            </form>
        </div>
    );

}

export default AddServeiTecnic;