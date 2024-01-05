import { Orders } from "../types";
import { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
import firebaseApp from "../firebase";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Button, Stack } from '@mui/material';
import { Form } from "react-bootstrap";
import TextField, { TextFieldProps } from '@mui/material/TextField';


const Ordres = () => {

    const db = getDatabase(firebaseApp);

    var [ordersList, setOrdersList] = useState<Orders[]>([]);
    var [totalPuntuation, setTotalPuntuation] = useState(0);
    var [totalOrders, setTotalOrders] = useState(0);
    const [searchText, setSearchText] = useState<string>("");
    const [startDate, setStartDate] = useState<Dayjs | null>(
        //dayjs(''),
        null
    );


    //pagination code
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex(currentIndex - 1);
    };

    const handleNext = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const handleStartDateChange = (newStartDate: Dayjs | null) => {
        setStartDate(newStartDate);
    };


    const [inputPage, setInputPage] = useState('');

    const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const pageNum = parseInt(event.target.value, 10) - 1; // Subtract 1 to get zero-based index
        if (!isNaN(pageNum) && pageNum >= 0 && pageNum < ordersList.length) {
            setCurrentIndex(pageNum);
        }
        setInputPage(event.target.value);
    };





    //same for endDate
    const [endDate, setEndDate] = useState<Dayjs | null>(
        //dayjs('2022-08-18T21:11:54'),
        null
    );

    const handleEndDateChange = (newEndDate: Dayjs | null) => {
        setEndDate(newEndDate);
    };

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };



    useEffect(() => {
        const ordersRef = ref(db, "/codes");
        let puntuation = 0;
        let ordersTotal = 0;

        onValue(ordersRef, (snapshot) => {

            const orders = snapshot.val();
            //order orders by inverting the order of the code keys
            //so that the first entries of the orders will be the last ones and viceversa



            const newOrdersList: Orders[] = [];

            for (let id in orders) {
                if (JSON.stringify(orders[id]).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) &&
                    (startDate === null || dayjs(orders[id].adminStarted).isAfter(startDate) || dayjs(orders[id].corteStarted).isAfter(startDate) || dayjs(orders[id].canteadoStarted).isAfter(startDate) || dayjs(orders[id].mecanizadoStarted).isAfter(startDate) || dayjs(orders[id].lacaStarted).isAfter(startDate) || dayjs(orders[id].cajonesStarted).isAfter(startDate) || dayjs(orders[id].uneroStarted).isAfter(startDate) || dayjs(orders[id].montajeStarted).isAfter(startDate) || dayjs(orders[id].espejosStarted).isAfter(startDate) || dayjs(orders[id].embalajeStarted).isAfter(startDate)) &&
                    (endDate === null || dayjs(orders[id].adminEnded).isBefore(endDate) || dayjs(orders[id].corteEnded).isBefore(endDate) || dayjs(orders[id].canteadoEnded).isBefore(endDate) || dayjs(orders[id].mecanizadoEnded).isBefore(endDate) || dayjs(orders[id].lacaEnded).isBefore(endDate) || dayjs(orders[id].cajonesEnded).isBefore(endDate) || dayjs(orders[id].uneroEnded).isBefore(endDate) || dayjs(orders[id].montajeEnded).isBefore(endDate) || dayjs(orders[id].espejosEnded).isBefore(endDate) || dayjs(orders[id].embalajeEnded).isBefore(endDate))) {
                    newOrdersList.push({ id, ...orders[id] });

                }
            }

            setOrdersList(newOrdersList);

            newOrdersList.map((order) => {
                let puntuationAndCode = order.code?.split("X");
                if (puntuationAndCode.length > 1) {
                    const points = parseInt(puntuationAndCode[1]);
                    //if points is NaN, add 0
                    if (isNaN(points)) {
                        puntuation += 0;
                    } else {
                        puntuation += points;
                    }
                } else {
                    puntuation += 0;
                }
                ordersTotal += 1
                return true;
            });
            setTotalPuntuation(puntuation);
            setTotalOrders(ordersTotal);
            if (ordersTotal === 0) {
                setOrdersList([]);
            }
        });


    }, [searchText, startDate, endDate]);


    function deleteProcess(code: string, processName: string, processStarted: string, processUser: string) {
        update(ref(db, 'codes/' + code), {
            [processName]: null,
            [processName + 'User']: null,
            [processName + 'Started']: null,
            [processName + 'Ended']: null,
        });
        //format processStarted to date in DD mm YYYY string
        let date = new Date(processStarted);
        let day = date.getDate();
        let monthNumber = (date.getMonth() + 1);
        let year = date.getFullYear();
        let monthString = "";
        //if month has only one digit, add a 0 before

        //Question: When using the React Developer Tools Chrome extension, if the React icon is red, it means that you are using "".
        //Answer: 

        if (monthNumber < 10) {
            monthString = "0" + monthNumber;
        } else {
            monthString = monthNumber.toString();
        }
        let dateString = day + " " + monthString + " " + year;

        //delete all inside processes/processName/dateString database
        remove(ref(db, 'processes/' + processName + '/' + dateString + '/' + code));


        //delete from user (orderByChild in users ref)


        var listRef = ref(db, 'users');
        //listref order by child processUser and equalTo processUser

        onValue(listRef, (snapshot) => {
            const data = snapshot.val();
            for (let key in data) {
                if (data[key].name === processUser) {
                    //delete from user
                    remove(ref(db, 'users/' + key + '/orders/' + dateString + '/' + dateString + '/' + code));

                }
            }
        });
    }



    return (
        <div>
            <div>
                <h1 style={{ textAlign: 'center' }}>Ordres</h1>

            </div>
            <div style={{ marginTop: '30px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form style={{ display: 'flex', width: '70vw' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack spacing={3}>
                                    <DesktopDatePicker
                                        label="Date desktop"
                                        inputFormat="DD/MM/YYYY"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} />}
                                    />

                                </Stack>
                                <Stack spacing={3}>
                                    <DesktopDatePicker
                                        label="Date desktop"
                                        inputFormat="DD/MM/YYYY"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>

                            <Form.Control aria-label={'orderSearch'} type="text"
                                placeholder="Buscar per codi, data o nom" onChange={handleSearchTextChange} />

                        </Form>
                    </div>
                    <Stack className="w-100 flex">
                        <Stack className="w-100 flex flex-row justify-content-center">
                            <Button variant="contained" onClick={handlePrev} disabled={currentIndex === 0}>
                                Previ
                            </Button>
                            <TextField
                                type="number"
                                value={inputPage}
                                onChange={handlePageInputChange}
                                sx={{ mx: 2, width: '80px' }} // Adjust styling as needed
                            />
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={currentIndex === ordersList.length - 1}
                                sx={{ marginLeft: '8px' }}
                            >
                                Següent
                            </Button>
                        </Stack>
                    </Stack>
                    <p>
                        Mostrant {currentIndex + 1} de {ordersList.length} ordres
                    </p>
                </div>
                <div style={{ margin: "10px" }}>
                    <p>Total puntuació: {totalPuntuation}</p>
                    <p>Total ordres: {totalOrders}</p>
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>



                    {ordersList[currentIndex] &&
                        <div
                            key={currentIndex}
                            style={{
                                backgroundColor: "#000000",
                                textAlign: 'left',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '5%',
                                border: '2px solid white',
                                padding: '20px',
                                margin: '10px',
                            }}

                        >
                            {getCodeAndPuntuation(ordersList[currentIndex].code)}
                            {/*Log on the console the order */}

                            {ordersList[currentIndex].admin ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Admin: {ordersList[currentIndex].adminUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].adminStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].adminEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "admin", ordersList[currentIndex].adminStarted, ordersList[currentIndex].adminUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {ordersList[currentIndex].corte ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Corte: {ordersList[currentIndex].corteUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].corteStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].corteEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "corte", ordersList[currentIndex].corteStarted, ordersList[currentIndex].corteUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*canteado*/}
                            {ordersList[currentIndex].canteado ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Canteado: {ordersList[currentIndex].canteadoUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].canteadoStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].canteadoEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "canteado", ordersList[currentIndex].canteadoStarted, ordersList[currentIndex].canteadoUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*mecanizado*/}
                            {ordersList[currentIndex].mecanizado ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Mecanizado: {ordersList[currentIndex].mecanizadoUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].mecanizadoStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].mecanizadoEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "mecanizado", ordersList[currentIndex].mecanizadoStarted, ordersList[currentIndex].mecanizadoUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*laca*/}
                            {ordersList[currentIndex].laca ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Laca: {ordersList[currentIndex].lacaUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].lacaStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].lacaEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "laca", ordersList[currentIndex].lacaStarted, ordersList[currentIndex].lacaUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*cajones*/}
                            {ordersList[currentIndex].cajones ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Cajones: {ordersList[currentIndex].cajonesUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].cajonesStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].cajonesEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "cajones", ordersList[currentIndex].cajonesStarted, ordersList[currentIndex].cajonesUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*unero*/}
                            {ordersList[currentIndex].unero ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Unero: {ordersList[currentIndex].uneroUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].uneroStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].uneroEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "unero", ordersList[currentIndex].uneroStarted, ordersList[currentIndex].uneroUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*montaje*/}
                            {ordersList[currentIndex].montaje ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Montaje: {ordersList[currentIndex].montajeUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].montajeStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].montajeEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "montaje", ordersList[currentIndex].montajeStarted, ordersList[currentIndex].montajeUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*espejos*/}
                            {ordersList[currentIndex].espejos ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Espejos: {ordersList[currentIndex].espejosUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].espejosStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].espejosEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "espejos", ordersList[currentIndex].espejosStarted, ordersList[currentIndex].espejosUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*embalaje*/}
                            {ordersList[currentIndex].embalaje ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Embalaje: {ordersList[currentIndex].embalajeUser}</p>
                                <p>Inici: {dayjs(ordersList[currentIndex].embalajeStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(ordersList[currentIndex].embalajeEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                    style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                    onClick={() => deleteProcess(ordersList[currentIndex].code, "embalaje", ordersList[currentIndex].embalajeStarted, ordersList[currentIndex].embalajeUser)}
                                    src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                    alt={"trashcan"}></img></div> : <p></p>}
                            {/*canteado*/}



                            {/*   {checkExist(index, order.code, order.adminUser, "admin", order.adminStarted, order.adminEnded)}

                            

 */}



                            {/* {checkExist(index, order.code, order.cajonesUser, "cajones", order.cajonesStarted, order.cajonesEnded)}
                                {checkExist(index, order.code, order.uneroUser, "unero", order.uneroStarted, order.uneroEnded)}
                                {checkExist(index, order.code, order.montajeUser, "montaje", order.montajeStarted, order.montajeEnded)}
                                {checkExist(index, order.code, order.espejosUser, "espejos", order.espejosStarted, order.espejosEnded)}
                                {checkExist(index, order.code, order.canteadoUser, "canteado", order.canteadoStarted, order.canteadoEnded)}
                                {checkExist(index, order.code, order.mecanizadoUser, "mecanizado", order.mecanizadoStarted, order.mecanizadoEnded)}

                            {checkExist(index, order.code, order.embalajeUser, "embalaje", order.embalajeStarted, order.embalajeEnded)} */}

                        </div>}

                </div>
            </div>
        </div>
    );



    function getCodeAndPuntuation(code: string): import("react").ReactNode {
        //split code by X to get the code and the puntuation
        let codeAndPuntuation = code?.split("X");
        let puntuation = codeAndPuntuation[1] || 0;
        return <div style={{ position: 'relative' }}><p>Codi: {codeAndPuntuation[0]}</p><p> Puntuació: {puntuation}</p><img style={{ position: 'absolute', right: 0, bottom: -15 }}
            role={'button'} width={"30px"}
            onClick={() => deleteOrder(code)}
            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
            alt={"trashcan"}></img></div>;
    }

    function deleteOrder(code: string) {
        set(ref(db, 'codes/' + code), {});
    }
}

export default Ordres;