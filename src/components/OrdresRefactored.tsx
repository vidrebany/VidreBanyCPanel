import { Orders } from "../types";
import { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, remove, update, get } from "firebase/database";
import firebaseApp from "../firebase";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import { Form } from "react-bootstrap";
import TextField, { TextFieldProps } from '@mui/material/TextField';


const OrdresRefactored = () => {

    const db = getDatabase(firebaseApp);

    var [ordersList, setOrdersList] = useState<Orders[]>([]);
    var [totalPuntuation, setTotalPuntuation] = useState(0);
    var [totalOrders, setTotalOrders] = useState(0);
    const [searchText, setSearchText] = useState<string>("");
    const [startDate, setStartDate] = useState<Dayjs | null>(
        //dayjs(''),
        null
    );

    const handleStartDateChange = (newStartDate: Dayjs | null) => {
        setStartDate(newStartDate);
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

        get(ordersRef).then((snapshot) => {
      
                const orders = snapshot.val();
                const newOrdersList: Orders[] = [];
    
                for (let id in orders) {
                    if (JSON.stringify(orders[id]).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) && (startDate === null || dayjs(orders[id].adminStarted).isAfter(startDate)) && (endDate === null || dayjs(orders[id].adminEnded).isBefore(endDate))) {
                        newOrdersList.push({ id, ...orders[id] });

                    }
                }
    
                setOrdersList(newOrdersList);
    
                newOrdersList.map((order) => {
                    puntuation += parseInt(order.code.split("X")[1])
                    ordersTotal += 1
                    return true;
                });
                setTotalPuntuation(puntuation);
                setTotalOrders(ordersTotal);
                if (ordersTotal === 0) {
                    setOrdersList([]);
                }
            });
        

    }, [searchText, startDate, endDate, db]);


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

                    {ordersList.map((order: Orders, index) => {



                        return (
                            <div
                                key={index}
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
                                {getCodeAndPuntuation(order.code)}
                                {/*Log on the console the order */}

                                {order.admin ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Admin: {order.adminUser}</p>
                                    <p>Inici: {dayjs(order.adminStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.adminEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "admin", order.adminStarted, order.adminUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {order.corte ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Corte: {order.corteUser}</p>
                                    <p>Inici: {dayjs(order.corteStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.corteEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "corte", order.corteStarted, order.corteUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*canteado*/}
                                {order.canteado ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Canteado: {order.canteadoUser}</p>
                                    <p>Inici: {dayjs(order.canteadoStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.canteadoEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "canteado", order.canteadoStarted, order.canteadoUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*mecanizado*/}
                                {order.mecanizado ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Mecanizado: {order.mecanizadoUser}</p>
                                    <p>Inici: {dayjs(order.mecanizadoStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.mecanizadoEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "mecanizado", order.mecanizadoStarted, order.mecanizadoUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*laca*/}
                                {order.laca ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Laca: {order.lacaUser}</p>
                                    <p>Inici: {dayjs(order.lacaStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.lacaEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "laca", order.lacaStarted, order.lacaUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*cajones*/}
                                {order.cajones ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Cajones: {order.cajonesUser}</p>
                                    <p>Inici: {dayjs(order.cajonesStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.cajonesEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "cajones", order.cajonesStarted, order.cajonesUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*unero*/}
                                {order.unero ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Unero: {order.uneroUser}</p>
                                    <p>Inici: {dayjs(order.uneroStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.uneroEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "unero", order.uneroStarted, order.uneroUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*montaje*/}
                                {order.montaje ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Montaje: {order.montajeUser}</p>
                                    <p>Inici: {dayjs(order.montajeStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.montajeEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "montaje", order.montajeStarted, order.montajeUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*espejos*/}
                                {order.espejos ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Espejos: {order.espejosUser}</p>
                                    <p>Inici: {dayjs(order.espejosStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.espejosEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "espejos", order.espejosStarted, order.espejosUser)}
                                        src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                                        alt={"trashcan"}></img></div> : <p></p>}
                                {/*embalaje*/}
                                {order.embalaje ? <div style={{ position: 'relative', border: '1px solid gray' }}><p>Embalaje: {order.embalajeUser}</p>
                                    <p>Inici: {dayjs(order.embalajeStarted).format("DD/MM/YYYY - HH:mm").toString()}</p> <p>Fi: {dayjs(order.embalajeEnded).format("DD/MM/YYYY - HH:mm").toString()}</p><img
                                        style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                                        onClick={() => deleteProcess(order.code, "embalaje", order.embalajeStarted, order.embalajeUser)}
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

                            </div>);
                    }
                    )}

                </div>
            </div>
        </div>
    );



    function getCodeAndPuntuation(code: string): import("react").ReactNode {
        //split code by X to get the code and the puntuation
        let codeAndPuntuation = code.split("X");
        return <div style={{ position: 'relative' }}><p>Codi: {codeAndPuntuation[0]}</p><p> Puntuació: {codeAndPuntuation[1]}</p><img style={{ position: 'absolute', right: 0, bottom: -15 }}
            role={'button'} width={"30px"}
            onClick={() => deleteOrder(code)}
            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
            alt={"trashcan"}></img></div>;
    }

    function deleteOrder(code: string) {
        set(ref(db, 'codes/' + code), {});
    }
}

export default OrdresRefactored;