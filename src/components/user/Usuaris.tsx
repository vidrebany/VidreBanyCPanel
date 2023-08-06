import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebaseApp from "../../firebase";
import { Users } from "../../types";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";


const Usuaris = () => {
  const navigate = useNavigate();

  const db = getDatabase(firebaseApp);
  //Users interface:
  /*
export type Users = {
  id: string;
  name: string;
  number: string;
  code: string;
  process: string;
  done: boolean;
}
  */
  const [usersList, setUsersList] = useState<Users[]>([]);

  const editUser = (user: Users) => {
    const newName = prompt("Introdueix el nou nom de l'usuari:", user.name);
    const newCode = prompt("Introdueix el nou codi de l'usuari:", user.code);
    const newProcess = prompt("Introdueix el nou procés de l'usuari:", user.process);

    if (newName && newCode && newProcess) {
      const userRef = ref(db, `/users/${user.number}`);
      set(userRef, { ...user, name: newName, code: newCode, process: newProcess });
    }
  };

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
              onClick={() => navigate('/user', { state: { number: value.number } })}
            >

              <p>{value.number}.{value.name}</p>
              <p>Procés: {value.process}</p>
              <p>Codi: {value.code}</p>
              <button className="btn btn-primary" onClick={(e) => {
                e.stopPropagation();
                editUser(value)
              }}>Editar</button> {/* Edit button */}

            </div>

          );
        })}
      </div>
    </div >
  );
};

export default Usuaris;