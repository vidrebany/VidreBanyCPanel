import Navbar from "../Navbar";
import "./styles/Incidencies.css"
import { Button, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";



const Incidencies = () => {

    

        const navigate = useNavigate();


        return (
            <div>
                <Navbar />
                <h1>No conformitats</h1>
                <Stack className="Stack" spacing={4} direction="column">
                    <Button onClick={() => navigate('/addincidencia')} variant="contained">Nova No conformitat</Button>
                    <Button onClick={() => navigate('/incidenciesobertes')} variant="contained">NO CONFORMITATS Obertes</Button>
                    <Button onClick={() => navigate('/incidenciestancades')} variant="contained">No conformitats Tancades</Button>
                </Stack>
            </div>
        );
    
}

export default Incidencies;