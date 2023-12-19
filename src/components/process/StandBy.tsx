import { useEffect, useState } from "react";
import { StandByOrder } from "../../types";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import firebaseApp from "../../firebase";


const StandBy = () => {

    const db = getDatabase(firebaseApp);


    var [standbyList, setStandbyList] = useState<StandByOrder[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredStanbyList, setFilteredStandbyList] = useState<StandByOrder[]>([]);


    useEffect(() => {
        const standbyRef = ref(db, '/standby');

        onValue(standbyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStandbyList(Object.values(data));
                console.log(data)
            }
        });
    }, [db])

    useEffect(() => {
        setFilteredStandbyList(standbyList.filter((order) =>
            order.code.toLocaleLowerCase().includes(searchTerm) ||
            order.process.toLocaleLowerCase().includes(searchTerm) ||
            order.started.toLocaleLowerCase().includes(searchTerm) ||
            order.ended?.toLocaleLowerCase().includes(searchTerm) || // Optional chaining operator
            order.mark?.toLocaleLowerCase().includes(searchTerm) // Optional chaining operator
        ));
    }, [searchTerm, standbyList]);


    const handleSearch = () => {
        setFilteredStandbyList(standbyList.filter((order) =>
            order.code.toLocaleLowerCase().includes(searchTerm) ||
            order.process.toLocaleLowerCase().includes(searchTerm) ||
            order.started.toLocaleLowerCase().includes(searchTerm) ||
            order.ended?.toLocaleLowerCase().includes(searchTerm) ||
            order.mark?.toLocaleLowerCase().includes(searchTerm)
        ));
    };




    const deleteOrder = (code: string) => {
        const orderRef = ref(db, '/standby/' + code);
        remove(orderRef).then(() => {
            alert("Ordre eliminada de standby correctament");
        }).catch((error) => {
            alert("Error eliminant ordre en standby: " + error.message);
        });
    }


    return (
        <div>
            <div>
                <h1 style={{ textAlign: 'center' }}>Llista standby:</h1>
            </div>
            <div className="justify-content-center w-100 align-items-center" style={{ margin: '20px' }}>
                <input type="text" placeholder="Buscar per codi, procés, data, anotació..." onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())} />
                <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
            </div>
            <div style={{ marginTop: '150px' }}>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Codi</th>        
                            <th>Procés</th>
                            <th>Data inici</th>
                            <th>Data final</th>
                            <th>Nota</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStanbyList.map((order) => (
                            <tr key={order.code}>
                                <td>{order.code}</td>
                                <td>{order.process}</td>
                                <td>{order.started}</td>
                                <td>{order.ended}</td>
                                <td>{order.mark}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => deleteOrder(order.code)}>Eliminar</button> {/* Delete button */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandBy;