import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MouseEvent } from "react";
import { useState } from "react";
import "./TransportationOptionsStyle.css"
import { Transports } from "../../../types";
import {Link, useNavigate} from 'react-router-dom';



const options = [
    'Mostrar PDF',
    'Editar Dades',
    'Reiniciar',
    'Eliminar',
];

interface TransportationOptionsProps {
    transport: Transports;
}

export const TransportationOptions: React.FC<TransportationOptionsProps> = ({ transport }) => {

    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);




    const ITEM_HEIGHT = 48;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const optionsOpen = Boolean(anchorEl);
    const handleOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (event: MouseEvent<HTMLElement>, index: number) => {
        switch (index) {
            
            case 0:
                //open transport.pdfUrl in new tab:
                window.open(transport.pdfUrl, "_blank");
                break;
            case 1:
                navigate(`/transport/edittransport/`, {state: {transport}})
                break;
            case 2:
                alert("Reiniciar");
                break;
            case 3:
                alert("Eliminar");
                break;
            default:
                break;
        }
        setSelectedIndex(index);
        setAnchorEl(null);
    };
    const handleOptionsClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="moreOptions">
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={optionsOpen ? 'long-menu' : undefined}
                aria-expanded={optionsOpen ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleOptionsClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={optionsOpen}
                onClose={handleOptionsClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )

}