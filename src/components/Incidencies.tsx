import Navbar from "./Navbar";
import "./styles/Incidencies.css"
import { Button, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";



const Incidencies = () => {

    

        const navigate = useNavigate();


        return (
            <div>
                <Navbar />
                <h1>Incidències</h1>
                <Stack className="Stack" spacing={4} direction="column">
                    <Button onClick={() => navigate('/addincidencia')} variant="contained">Nova Incidència</Button>
                    <Button variant="contained">Incidències Obertes</Button>
                    <Button variant="contained">Incidències Tancades</Button>
                </Stack>
            </div>
        );
    
}

export default Incidencies;