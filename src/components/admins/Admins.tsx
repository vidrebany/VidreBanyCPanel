import { useEffect, useState } from "react";
import { AdminsData } from "../../types";
import Navbar from "../Navbar";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./styles/Admins.css"
import Alert from "@mui/material/Alert";


const Admins = () => {
    const navigate = useNavigate();

    //firebase database
    const db = getDatabase(firebaseApp);
    //admin ref
    const adminsRef = ref(db, "/admins/");

    //admin list useState that has a list of AdminsData[] objects
    const [adminList, setAdminList] = useState<AdminsData[]>([]);
    const [adminName, setAdminName] = useState('');

    //get admin list
    useEffect(() => {
        onValue(adminsRef, (snapshot) => {
            const data = snapshot.val();

            let adminListTemp: AdminsData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let adminData: AdminsData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    adminListTemp.push(adminData);
                }
            }



                setAdminList(adminListTemp);

            


        });
    }, [adminList]);







    function showFields(): void {
        const textField = document.querySelectorAll(".textField") as NodeListOf<HTMLElement>;
        const addButton = document.getElementById("addButton") as HTMLElement;
        if (textField) {
            for (let i = 0; i < textField.length; i++) {
                if (textField[i].style.visibility === "collapse") {
                    textField[i].style.visibility = "visible";
                    textField[i].style.height = "auto";
                } else {
                    textField[i].style.visibility = "collapse";
                    textField[i].style.height = "0px";
                }
            }
        }
    }

    function addNewAdmin(): void {
        showFields();
        //push new adminName to firebase, the pushed content will be the adminName and the generated id
        const dbRef = ref(db, '/admins/');

        const newAdminRef = push(dbRef);
        //get key from newAdminRef
        const key = newAdminRef.key;

        set(newAdminRef, {
            id: key,
            name: adminName,
        });
        //select Alert element
        let alert = document.querySelector('.alert') as HTMLDivElement;
        if (alert) {
            alert.style.visibility = "visible";
            setTimeout(() => {
                alert.style.visibility = "hidden";
            }, 3000);
        }
    }

    function deleteAdmin(id: string): void {
        const dbRef = ref(db, '/admins/' + id);
        remove(dbRef);      
    }

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <Navbar />
            <Alert className="alert" severity="success">Èxit</Alert>
            <div>
                <h1 style={{ textAlign: 'center' }}>Admins</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Lista administradors</h3>
            <Stack spacing={2} direction="column">
                <Button id="addButton" onClick={() => showFields()} variant="contained">Afegir admin</Button>
                <TextField className="textField" style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Nom admin."
                    rows={4}
                    value={adminName}
                    variant="outlined"
                    onChange={(e) => setAdminName(e.target.value)}
                />
                <Button className="textField" onClick={() => addNewAdmin()} variant="contained">Afegir nou</Button>

            </Stack>
            <div className="listView">

                {/*Map adminList*/}
                {adminList.map((admin) => {
                    

                    return (
                        <div className="adminCard" key={admin.id}>
                            <p>{admin.name}</p>
                            <img
                            style={{ position: 'absolute', right: 0, bottom: 10 }} role={'button'} width={"30px"}
                            onClick={() => deleteAdmin(admin.id)}
                            src={"https://www.shareicon.net/data/128x128/2015/09/06/96798_trash_512x512.png"}
                            alt={"trashcan"}></img>
                        </div>
                    );
                })}


            </div>

        </div >
    );
};

export default Admins;