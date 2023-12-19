import { useEffect, useState } from "react";
import { AdminsData } from "../../types";
import firebaseApp from "../../firebase";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import "./styles/Admins.css"
import Alert from "@mui/material/Alert";


const Admins = () => {

    //firebase database
    const db = getDatabase(firebaseApp);
    //admin ref
    const adminsRef = ref(db, "/admins/");

    //admin list useState that has a list of AdminsData[] objects
    const [adminList, setAdminList] = useState<AdminsData[]>([]);
    const [adminName, setAdminName] = useState('');
    const [addAdminHidden, setAddAdminHidden] = useState(true);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminList]);




    function showFields(): void {

        const addAdminDiv = document.querySelectorAll(".addAdmin")[0] as HTMLElement;
        if (addAdminHidden) {
            setAddAdminHidden(false);
            addAdminDiv.style.visibility = "visible";
            addAdminDiv.style.height = "auto";

        } else {
            setAddAdminHidden(true);
            addAdminDiv.style.visibility = "collapse";
            addAdminDiv.style.height = "0px";
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
            <Alert className="alert" severity="success">Èxit</Alert>
            <div>
                <h1 style={{ textAlign: 'center' }}>Admins</h1>
            </div>


            <h3>Lista administradors</h3>
            <Stack spacing={2} direction="column">
                <Button id="addButton" onClick={() => showFields()} variant="contained">Afegir admin</Button>
                <div className="addAdmin d-flex flex-column" style={{ 'visibility': 'collapse', 'height' : '0' }}>
                    <TextField style={{ margin: "10px" }}
                        id="outlined-multiline-static"
                        label="Nom admin."
                        rows={4}
                        value={adminName}
                        variant="outlined"
                        onChange={(e) => setAdminName(e.target.value)}
                    />
                    <Button onClick={() => addNewAdmin()} variant="contained">Afegir nou</Button>
                </div>

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