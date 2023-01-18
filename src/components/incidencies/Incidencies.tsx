import Navbar from "../Navbar";
import "./styles/Incidencies.css"
import { Button, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";



const Incidencies = () => {

    

        const navigate = useNavigate();


        return (
            <div>
                <Navbar />
                <h1>Inconformitats</h1>
                <Stack className="Stack" spacing={4} direction="column">
                    <Button onClick={() => navigate('/addincidencia')} variant="contained">Nova Inconformitat</Button>
                    <Button onClick={() => navigate('/incidenciesobertes')} variant="contained">INCONFORMITATS Obertes</Button>
                    <Button onClick={() => navigate('/incidenciestancades')} variant="contained">Inconformitats Tancades</Button>
                </Stack>
            </div>
        );
    
}

export default Incidencies;