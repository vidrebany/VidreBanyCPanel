import Navbar from './Navbar';
import { Orders } from "../types";
import { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
import firebaseApp from "../firebase";
import dayjs, { Dayjs } from 'dayjs';


const OrdresRefactored = () => {

    const db = getDatabase(firebaseApp);

    var [ordersList, setOrdersList] = useState<Orders[]>([]);
    var [totalPuntuation, setTotalPuntuation] = useState(0);
    var [totalOrders, setTotalOrders] = useState(0);




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

    }, []);


    return (
        <div>
            <Navbar />
            <h1>Ordres Refactored</h1>

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
                            <p> {order.code} {order.corteUser} {dayjs(order.corteStarted).format("DD/MM/YYYY - hh:mm").toString()} {order.corteEnded}</p>


                            {/* {checkExist(index, order.code, order.cajonesUser, "cajones", order.cajonesStarted, order.cajonesEnded)}
                                {checkExist(index, order.code, order.uneroUser, "unero", order.uneroStarted, order.uneroEnded)}
                                {checkExist(index, order.code, order.montajeUser, "montaje", order.montajeStarted, order.montajeEnded)}
                                {checkExist(index, order.code, order.espejosUser, "espejos", order.espejosStarted, order.espejosEnded)}
                                {checkExist(index, order.code, order.adminUser, "admin", order.adminStarted, order.adminEnded)}
                                {checkExist(index, order.code, order.canteadoUser, "canteado", order.canteadoStarted, order.canteadoEnded)}
                                {checkExist(index, order.code, order.mecanizadoUser, "mecanizado", order.mecanizadoStarted, order.mecanizadoEnded)}

                            {checkExist(index, order.code, order.embalajeUser, "embalaje", order.embalajeStarted, order.embalajeEnded)} */}
                            <p> {order.code} {order.mecanizadoUser} {dayjs(order.mecanizadoStarted).format("DD/MM/YYYY - hh:mm").toString()} {order.mecanizadoEnded}</p>

                        </div>);
                }
                )}

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