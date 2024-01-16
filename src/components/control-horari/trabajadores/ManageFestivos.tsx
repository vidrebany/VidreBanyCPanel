import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, ListGroup } from 'react-bootstrap';
import { Api } from "../../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageFestivos = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [datesList, setDatesList] = useState<string[]>([]);


    const fetchDatesList = useCallback(
        async () => {
            const response = await Api.get("/festivos")
                .catch((err) => {
                    console.log(err);
                    toast.error("Error al cargar los festivos");
                });
            if (!response) return;

            const data = response.data;
            //get only .date from the response
            const dates = data.map((d: any) => d.date);
            // order the dates from oldest to newest
            dates.sort((a: string, b: string) => {
                const [aYear, aMonth, aDay] = b.split("-");
                const [bYear, bMonth, bDay] = a.split("-");
                if (aYear !== bYear) {
                    return parseInt(aYear) - parseInt(bYear);
                }
                if (aMonth !== bMonth) {
                    return parseInt(aMonth) - parseInt(bMonth);
                }
                return parseInt(aDay) - parseInt(bDay);
            });
            setDatesList(dates);
        },
        [],
    );

    const postDate = async () => {
        const response = await Api.post("/festivos", { date: selectedDate })
            .catch((err) => {
                console.log(err);
                toast.error("Error al añadir el festivo");
            });
        console.log(response)
        //const data = await response.json();
        //setDatesList(data);

    }

    const deleteDate = async (date: string) => {
        const response = await Api.delete(`/festivos/${date}`)
            .catch((err) => {
                console.log(err);
                toast.error("Error al eliminar el festivo");
            });
        //const data = await response.json();
        //setDatesList(data);
    }


    useEffect(() => {
        fetchDatesList();
        if (selectedDate) {
            console.log(selectedDate);
            // You can add logic here to upload the selected date to the database
        }
    }, [selectedDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const handleAddDate = async () => {
        if (!selectedDate) {
            toast.error("Debes seleccionar una fecha");
            return;
        }
        await postDate();
        setDatesList([...datesList, selectedDate]);
        setSelectedDate(""); // Reset the input after adding the date to the list
    };

    const handleDeleteDate = async (index: number) => {
        await deleteDate(datesList[index]);
        const newList = datesList.filter((_, i) => i !== index);
        setDatesList(newList);
    };

    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <h1>Gestionar Festivos</h1>
            <button className="btn btn-primary" onClick={() => navigate("/control-horari")}>Volver</button>
            {selectedDate && <p>Fecha seleccionada: {selectedDate}</p>}
            <Form.Group>
                <Form.Label>Selecciona una fecha a subir:</Form.Label>
                <Form.Control type="date" value={selectedDate} onChange={handleDateChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleAddDate} className="mt-2">
                Añadir fecha
            </Button>

            <ListGroup className="mt-3">
                {datesList.map((date, index) => (
                    <ListGroup.Item key={index}>
                        {date}
                        <Button
                            variant="danger"
                            size="sm"
                            className="float-right"
                            onClick={() => handleDeleteDate(index)}
                        >
                            Eliminar
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default ManageFestivos;