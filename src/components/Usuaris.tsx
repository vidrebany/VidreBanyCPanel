import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseApp from "../firebase";
import { Users } from "../types";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";


const Usuaris = () => {
  const navigate = useNavigate();

  const db = getDatabase(firebaseApp);
  const [usersList, setUsersList] = useState<Users[]>([]);

  useEffect(() => {
    const todoRef = ref(db, "/users");

    onValue(todoRef, (snapshot) => {
      const data = snapshot.val();
      const newUsersList: Users[] = [];

      for (let id in data) {
        newUsersList.push({ id, ...data[id] });
      }

      setUsersList(newUsersList);
    });
  }, [db]);


  return (
    <div>
      <Navbar />
      <div>
        <h1 style={{ textAlign: 'center' }}>Escollir usuari:</h1>
      </div>

      {/*Sepparate from Navbar 150px*/}
      <div style={{ marginTop: '150px' }}>

        {usersList.map((value, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "#000000",
                position: 'relative', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                textAlign: 'left',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                borderRadius: '5%',
                border: '2px solid white',
                padding: '10px',
                margin: '10px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/user', { state: { number: value.number} })}
            >

              <p>{value.number}.{value.name}</p>
              <p>Procés: {value.process}</p>
              <p>Codi: {value.code}</p>

            </div>

          );
        })}
      </div>
    </div >
  );
};

export default Usuaris;