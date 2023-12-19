import { useNavigate } from "react-router";


const ControlHorari = () => {
    const navigate = useNavigate();
    return (
        <div className="container tecnic d-flex mt-2">
            <h1 className="text">Control Horari</h1>
            <div className="d-flex flex-column justify-content-center">
                <button className="btn btn-primary" onClick={() => navigate("trabajadores")}>Gestionar trabajadores</button>
                <button className="btn btn-primary">Gestionar envío de mails</button>
            </div>
        </div>
    )
}

export default ControlHorari;