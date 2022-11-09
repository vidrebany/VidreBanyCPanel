import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import firebaseApp from "../firebase";
import { Button, Form } from "react-bootstrap";
import { getDatabase, ref, onValue } from "firebase/database";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";


const Process = () => {

    const location = useLocation();
    var number = "";

    var orders = {
        "1": {
            "": {
                "": {
                    "code": "",
                    "ended": "25/09/22-12:26",
                    "user": "Administració",
                    "started": "25/09/22-12:26"
                }
            },
            "date": ""
        },
        "2": {
            "": {
                "": {
                    "code": "",
                    "ended": "",
                    "user": "",
                    "started": ""
                }
            },
            "date": ""
        }
    };
    const [ordersConstList, setOrdersConstList] = useState<any[]>([]);


    const db = getDatabase(firebaseApp);
    const [show, setShow] = React.useState(false);
    const [show1, setShow1] = React.useState(false);
    const [show2, setShow2] = React.useState(false);
    var [ordersList, setOrdersList] = useState(orders);

    var [totalPuntuation, setTotalPuntuation] = useState(0);
    var [totalOrders, setTotalOrders] = useState(0);

    var [namee, setName] = useState("");
    var [codee, setCode] = useState("");
    var [processs, setProcess] = useState("");


    //create an Object.entries array from the location object, if key is state, return the value of the number key
    Object.entries(location).forEach(([key, value]) => {
        if (key === "state") {
            number = value.number;
        }
    });

    const todoRef = ref(db, "/processes/" + number.toLowerCase());

    var code = "sense codi";
    var name = "sense nom";
    var process = "sense procés";



    //exemple orders object:
    /*
    {
    "25 09 2022": {
        "25 09 2022": {
            "12345X23": {
                "code": "12345X23",
                "ended": "25/09/22-12:26",
                "process": "Corte",
                "started": "25/09/22-12:26"
            }
        },
        "date": "25 09 2022"
    }
}
    */

    useEffect(() => {
        let puntuation = 0;
        let ordersTotal = 0;
        let temp = 0;

        onValue(todoRef, (snapshot) => {

            const data = snapshot.val();
            code = data.code;
            name = data.name;
            process = data.process;
            setOrdersConstList(data);
            setOrdersList(data);

            //get total puntuation from orders by splitting the order code by X and getting the [1] index which is the puntuation
            for (let id in data) {
                for (let id2 in data[id]) {
                    for (let id3 in data[id][id2]) {
                        if (data[id][id2][id3].code !== undefined) {
                            puntuation += parseInt(data[id][id2][id3].code.split("X")[1]);
                            ordersTotal++;
                        }

                    }
                }
            }
            // eslint-disable-next-line array-callback-return
            //newOrdersList.map((order) => {
            //   puntuation += parseInt(order.code.split("X")[1]);
            //    ordersTotal += 1;
            // });

            setTotalPuntuation(puntuation);
            setTotalOrders(ordersTotal);
            setName(name)
            setCode(code)
            setProcess(process)
            puntuation = 0;
            ordersTotal = 0;
        });

    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if ((e.target.value) === "") {
            onValue(todoRef, (snapshot) => {
                let puntuation = 0;
                let ordersTotal = 0;
                const data = snapshot.val();
                code = data.code;
                name = data.name;
                process = data.process;

                for (let id in data) {
                    if (id === "orders") {

                    }
                }
                setOrdersConstList(data);
                setOrdersList(data);


                //get total puntuation from orders by splitting the order code by X and getting the [1] index which is the puntuation
                for (let id in data.orders) {
                    for (let id2 in data.orders[id]) {
                        for (let id3 in data.orders[id][id2]) {
                            if (data.orders[id][id2][id3].code !== undefined) {
                                puntuation += parseInt(data.orders[id][id2][id3].code.split("X")[1]);
                                ordersTotal++;
                            }

                        }
                    }
                }

                setTotalPuntuation(puntuation);
                setTotalOrders(ordersTotal);
                puntuation = 0;
                ordersTotal = 0;
                setName(name)
                setCode(code)
                setProcess(process)
            });

        } else {
            let puntuation = 0;
            let ordersTotal = 0;
            let temp = 0;
            //get total puntuation from ordersConstList by splitting the order code by X and getting the [1] index which is the puntuation
            var newOrdersList: any = [];

            temp++;

            //filter ordersList order.code and corteUser based on splitted[i]

            //split splitted[i] by space
            const splitted = e.target.value.split(" ");
            var filteredOrders = ordersConstList;
            for (let i = 0; i < splitted.length; i++) {
                // eslint-disable-next-line array-callback-return
                for (let id in ordersConstList) {
                    
                        for (let id2 in ordersConstList[id]) {
                           
                                for (let id3 in ordersConstList[id][id2]) {
                                    
                               

                                        if (ordersConstList[id][id2][id3].code !== undefined) {
                                            if (ordersConstList[id][id2][id3].code.toLowerCase().includes(splitted[i].toLowerCase())) {
                                                newOrdersList[id] = ordersConstList[id];
                                            }
                                            else if (ordersConstList[id][id2][id3].user !== undefined) {
                                                if (ordersConstList[id][id2][id3].user.toLowerCase().includes(splitted[i].toLowerCase())) {
                                                    newOrdersList[id] = ordersConstList[id];
                                                }
                                                else if (ordersConstList[id][id2][id3].started !== undefined) {
                                                    if (ordersConstList[id][id2][id3].started.toLowerCase().includes(splitted[i].toLowerCase())) {
                                                        newOrdersList[id] = ordersConstList[id];
                                                    }
                                                    else if (ordersConstList[id][id2][id3].ended !== undefined) {
                                                        if (ordersConstList[id][id2][id3].ended.toLowerCase().includes(splitted[i].toLowerCase())) {
                                                            newOrdersList[id] = ordersConstList[id];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    
                                }
                            
                        }
                    
                }

            }
            // eslint-disable-next-line array-callback-return
            for (let id in newOrdersList) {
                for (let id2 in newOrdersList[id]) {
                    for (let id3 in newOrdersList[id][id2]) {
                        if (newOrdersList[id][id2][id3].code !== undefined) {
                            puntuation += parseInt(newOrdersList[id][id2][id3].code.split("X")[1]);
                            ordersTotal++;
                        }
                    }
                }
            }

            setTotalPuntuation(puntuation);
            setTotalOrders(ordersTotal);

            setOrdersList(newOrdersList);

            puntuation = 0;
            ordersTotal = 0;
        }


    };
    return (

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <Navbar />

            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form style={{ display: 'flex', width: '70vw' }}>
                        <Form.Control aria-label={'orderSearch'} type="text"
                            placeholder="Buscar per codi, data o nom" onChange={handleChange} />
                        <Button type="submit">
                            Buscar
                        </Button>
                    </Form>
                </div>
            </div>

            <h1>{number}</h1>

            <p>Total puntuació: {totalPuntuation}</p>
            <p>Total ordres: {totalOrders}</p>
            {/*Display orders recursively with a dropdown using bootstrap*/}

            <div className="accordion" id="accordionExample">
                {Object.entries(ordersList).map(([key, value]) => {

                    return (
                        <div key={key} className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button onClick={() => setShow(!show)} className="accordion-button" type="button" data-toggle="collapse" data-target={"#collapse" + key} aria-expanded="true" aria-controls={"collapse" + key}>
                                    {key}
                                </button>
                            </h2>
                            <div id={"collapse" + key} style={show ? { display: "block" } : { display: 'none' }} className="accordion-collapse collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div className="accordion" id="accordionExample">
                                        {Object.entries(value).map(([key, value]) => {
                                            if (key !== "date") {
                                                return (
                                                    <div key={key} className="accordion-item">
                                                        <h2 className="accordion-header" id="headingOne">
                                                            <button onClick={() => setShow1(!show1)} className="accordion-button" type="button" data-toggle="collapse" data-target={"#collapse" + key} aria-expanded="true" aria-controls={"collapse" + key}>
                                                                {key}
                                                            </button>
                                                        </h2>
                                                        <div id={"collapse" + key} style={show1 ? { display: "block" } : { display: 'none' }} className="accordion-collapse collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                                            <div className="accordion-body">
                                                                <div className="accordion" id="accordionExample">
                                                                    {Object.entries(value).map(([key, value]) => {
                                                                        return (
                                                                            <div key={key} className="accordion-item">
                                                                                <h2 className="accordion-header" id="headingOne">
                                                                                    <button onClick={() => setShow2(!show2)} className="accordion-button" type="button" data-toggle="collapse" data-bs-target={"#collapse" + key} aria-expanded="true" aria-controls={"collapse" + key}>
                                                                                        {key}
                                                                                    </button>
                                                                                </h2>
                                                                                <div id={"collapse" + key} style={show2 ? { display: "block" } : { display: 'none' }} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                                                    <div className="accordion-body">
                                                                                        <p>Codi: {value.code}</p>
                                                                                        <p>Usuari: {value.user}</p>
                                                                                        <p>Inici: {value.started}</p>
                                                                                        <p>Fi: {value.ended}</p>


                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                return false;
                                            }

                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                })}
            </div>
        </div>



    );
};
export default Process;