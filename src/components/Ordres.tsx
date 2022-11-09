import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
// Import firebase configuration from firebase.ts file
import firebaseApp from "../firebase";
import Navbar from './Navbar';
import { Orders } from "../types";
//Datepicker
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


const db = getDatabase(firebaseApp);



const Ordres = () => {
    const [ordersConstList, setOrdersConstList] = useState<Orders[]>([]);
    var [totalPuntuation, setTotalPuntuation] = useState(0);
    var [totalOrders, setTotalOrders] = useState(0);
    var [ordersList, setOrdersList] = useState<Orders[]>([]);

    const [startDate, setStartDate] = useState<Dayjs | null>(
        //dayjs(''),
        null
    );

    const handleStartDateChange = (newStartDate: Dayjs | null) => {
        setStartDate(newStartDate);
                    if (startDate != null && endDate != null) {
                alert(getDates(startDate, endDate));
            }
    };


    //same for endDate
    const [endDate, setEndDate] = useState<Dayjs | null>(
        //dayjs('2022-08-18T21:11:54'),
        null
    );

        const handleEndDateChange = (newEndDate: Dayjs | null) => {
            setEndDate(newEndDate);
            //alert getDates
            if (startDate != null && endDate != null) {
                alert(getDates(startDate, endDate));
            }
        };
        
   //get startDate and endDate in DD/MM/YYYY format and calculate the range of days also in DD/MM/YYYY format inside a list
   const getDates = (startDate: Dayjs | null, endDate: Dayjs) => {
    let dates = [],
    //transform startDate to Date
    startDateTransformed = startDate.toDate(),
    //transform endDate to Date
    endDateTransformed = endDate.toDate(),

    //get the difference between startDate and endDate in days (taking note the months) in a list
    currentDate = startDateTransformed,
    addDays = function (this: any, days: number) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (currentDate <= endDateTransformed) {
        dates.push(dayjs(currentDate).format('DD/MM/YYYY'));
        currentDate = addDays.call(currentDate, 1);
    }
    
    return dates;
}


    useEffect(() => {
        const ordersRef = ref(db, "/codes");
        let puntuation = 0;
        let ordersTotal = 0;

        onValue(ordersRef, (snapshot) => {
            const orders = snapshot.val();
            const newOrdersList: Orders[] = [];

            for (let id in orders) {
                newOrdersList.push({ id, ...orders[id] });
            }

            setOrdersList(newOrdersList);
            setOrdersConstList(newOrdersList);

            newOrdersList.map((order) => {
                puntuation += parseInt(order.code.split("X")[1])
                ordersTotal += 1
                return true;
            });
            setTotalPuntuation(puntuation);
            setTotalOrders(ordersTotal);
        });

    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if ((e.target.value) === "") {
            let puntuation = 0;
            let ordersTotal = 0;

            const ordersRef = ref(db, "/codes");

            onValue(ordersRef, (snapshot) => {
                const orders = snapshot.val();
                const newOrdersList: Orders[] = [];

                for (let id in orders) {
                    newOrdersList.push({ id, ...orders[id] });
                }

                setOrdersList(newOrdersList);

                //get total puntuation from orders by splitting orders.code by X and getting the [1] index which is the code
                // eslint-disable-next-line array-callback-return
                newOrdersList.map((order) => {
                    puntuation += parseInt(order.code.split("X")[1]);
                    ordersTotal += 1;
                });
                setTotalPuntuation(puntuation);
                setTotalOrders(ordersTotal);
            });

        } else {
            //filter ordersList order.code and corteUser based on splitted[i]
            let puntuation = 0;
            let ordersTotal = 0;
            //split splitted[i] by space
            const splitted = e.target.value.split(" ");
            var filteredOrders = ordersConstList;

            for (let i = 0; i < splitted.length; i++) {
                filteredOrders = ordersConstList.filter((order) => {
                    console.log(ordersConstList);

                    return (order.code.toLowerCase().includes(splitted[i])) ||
                        (order.code.toLowerCase().includes(splitted[i - 1])) ||
                        (order.corteUser !== undefined && order.corteUser.toLowerCase().includes((splitted[i]))) ||
                        (order.corteUser !== undefined && order.corteUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.corteStarted !== undefined && new Date(order.corteStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.corteStarted !== undefined && new Date(order.corteStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.corteEnded !== undefined && new Date(order.corteEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.corteEnded !== undefined && new Date(order.corteEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.cajonesUser !== undefined && order.cajonesUser.toLowerCase().includes((splitted[i]))) ||
                        (order.cajonesUser !== undefined && order.cajonesUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.cajonesStarted !== undefined && new Date(order.cajonesStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.cajonesStarted !== undefined && new Date(order.cajonesStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.cajonesEnded !== undefined && new Date(order.cajonesEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.cajonesEnded !== undefined && new Date(order.cajonesEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.uneroUser !== undefined && order.uneroUser.toLowerCase().includes((splitted[i]))) ||
                        (order.uneroUser !== undefined && order.uneroUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.uneroStarted !== undefined && new Date(order.uneroStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.uneroStarted !== undefined && new Date(order.uneroStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.uneroEnded !== undefined && new Date(order.uneroEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.uneroEnded !== undefined && new Date(order.uneroEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.montajeUser !== undefined && order.montajeUser.toLowerCase().includes((splitted[i]))) ||
                        (order.montajeUser !== undefined && order.montajeUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.montajeStarted !== undefined && new Date(order.montajeStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.montajeStarted !== undefined && new Date(order.montajeStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.montajeEnded !== undefined && new Date(order.montajeEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.montajeEnded !== undefined && new Date(order.montajeEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.espejosUser !== undefined && order.espejosUser.toLowerCase().includes((splitted[i]))) ||
                        (order.espejosUser !== undefined && order.espejosUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.espejosStarted !== undefined && new Date(order.espejosStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.espejosStarted !== undefined && new Date(order.espejosStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.espejosEnded !== undefined && new Date(order.espejosEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.espejosEnded !== undefined && new Date(order.espejosEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.adminUser !== undefined && order.adminUser.toLowerCase().includes((splitted[i]))) ||
                        (order.adminUser !== undefined && order.adminUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.adminStarted !== undefined && new Date(order.adminStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.adminStarted !== undefined && new Date(order.adminStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.adminEnded !== undefined && new Date(order.adminEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.adminEnded !== undefined && new Date(order.adminEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.canteadoUser !== undefined && order.canteadoUser.toLowerCase().includes((splitted[i]))) ||
                        (order.canteadoUser !== undefined && order.canteadoUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.canteadoStarted !== undefined && new Date(order.canteadoStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.canteadoStarted !== undefined && new Date(order.canteadoStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.canteadoEnded !== undefined && new Date(order.canteadoEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.canteadoEnded !== undefined && new Date(order.canteadoEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.mecanizadoUser !== undefined && order.mecanizadoUser.toLowerCase().includes((splitted[i]))) ||
                        (order.mecanizadoUser !== undefined && order.mecanizadoUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.mecanizadoStarted !== undefined && new Date(order.mecanizadoStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.mecanizadoStarted !== undefined && new Date(order.mecanizadoStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.mecanizadoEnded !== undefined && new Date(order.mecanizadoEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.mecanizadoEnded !== undefined && new Date(order.mecanizadoEnded).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.embalajeUser !== undefined && order.embalajeUser.toLowerCase().includes((splitted[i]))) ||
                        (order.embalajeUser !== undefined && order.embalajeUser.toLowerCase().includes((splitted[i - 1]))) ||
                        (order.embalajeStarted !== undefined && new Date(order.embalajeStarted).toLocaleDateString().includes(splitted[i])) ||
                        (order.embalajeStarted !== undefined && new Date(order.embalajeStarted).toLocaleDateString().includes(splitted[i - 1])) ||
                        (order.embalajeEnded !== undefined && new Date(order.embalajeEnded).toLocaleDateString().includes(splitted[i])) ||
                        (order.embalajeEnded !== undefined && new Date(order.embalajeEnded).toLocaleDateString().includes(splitted[i - 1]))
                });




            }


            console.log(filteredOrders);
            filteredOrders.map((order) => {
                puntuation += parseInt(order.code.split("X")[1]);
                ordersTotal += 1;
                setOrdersList(filteredOrders);

                return true;
            });
            setTotalPuntuation(puntuation);
            setTotalOrders(ordersTotal);
            puntuation = 0;
            ordersTotal = 0;

        }

    };



    return (
        <div>
            <div>
                <Navbar />
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
                                placeholder="Buscar per codi, data o nom" onChange={handleChange} />
                            <Button type="submit">
                                Buscar
                            </Button>
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

                    {ordersList.map((order, index) => {

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
                                {checkExist(index, order.code, order.corteUser, "corte", order.corteStarted, order.corteEnded)}
                                {checkExist(index, order.code, order.cajonesUser, "cajones", order.cajonesStarted, order.cajonesEnded)}
                                {checkExist(index, order.code, order.uneroUser, "unero", order.uneroStarted, order.uneroEnded)}
                                {checkExist(index, order.code, order.montajeUser, "montaje", order.montajeStarted, order.montajeEnded)}
                                {checkExist(index, order.code, order.espejosUser, "espejos", order.espejosStarted, order.espejosEnded)}
                                {checkExist(index, order.code, order.adminUser, "admin", order.adminStarted, order.adminEnded)}
                                {checkExist(index, order.code, order.canteadoUser, "canteado", order.canteadoStarted, order.canteadoEnded)}
                                {checkExist(index, order.code, order.mecanizadoUser, "mecanizado", order.mecanizadoStarted, order.mecanizadoEnded)}
                                {checkExist(index, order.code, order.embalajeUser, "embalaje", order.embalajeStarted, order.embalajeEnded)}

                            </div>);
                    }
                    )}

                </div>


            </div>
        </div>
    )


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
                    alert(JSON.stringify(data[key].orders));
                    remove(ref(db, 'users/' + key + '/orders/' + dateString + '/' + dateString + '/' + code));

                }
            }
        });
    }

    function deleteOrder(code: string) {
        set(ref(db, 'codes/' + code), {});
    }

    function checkExist(index: number, code: string, processUser: string, processName: string, processStarted: string, processEnded: string): import("react").ReactNode {
        if (processUser !== undefined) {
            //format to date processStarted
            var startDateFormatted;
            if (processStarted !== undefined) {
                const startDate = new Date(processStarted);
                startDateFormatted = startDate.toLocaleDateString();
            } else {
                startDateFormatted = "sense començar";
            }

            var endDateFormatted;
            if (processEnded !== undefined) {
                const endDate = new Date(processEnded);
                endDateFormatted = endDate.toLocaleDateString();
            } else {
                endDateFormatted = "sense acabar";
            }

            //improve the if statements above into a switch case

            switch (processName) {
                case "admin":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Admin: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "corte":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Corte: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "cajones":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Cajones: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "unero":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Uñero: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "montaje":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Montaje: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "espejos":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Espejos: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "canteado":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Canteado: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "mecanizado":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}>
                        <p>Mecanizado: {processUser}</p> <p>Inici: {startDateFormatted}</p>
                        <p>Fi: {endDateFormatted}</p><img style={{ position: 'absolute', right: 0, bottom: 10 }}
                            role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                case "embalaje":
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Embalaje: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
                default:
                    return <div style={{ position: 'relative', border: '1px solid gray' }}><p>Admin: {processUser}</p>
                        <p>Inici: {startDateFormatted}</p> <p>Fi: {endDateFormatted}</p><img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteProcess(code, processName, processStarted, processUser)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img></div>;
            }
        }
    }


    function getCodeAndPuntuation(code: string): import("react").ReactNode {
        //split code by X to get the code and the puntuation
        let codeAndPuntuation = code.split("X");
        return <div style={{ position: 'relative' }}><p>Codi: {codeAndPuntuation[0]}</p><p> Puntuació: {codeAndPuntuation[1]}</p><img style={{ position: 'absolute', right: 0, bottom: -15 }}
            role={'button'} width={"30px"}
            onClick={() => deleteOrder(code)}
            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
            alt={"trashcan"}></img></div>;
    }
}


export default Ordres;



