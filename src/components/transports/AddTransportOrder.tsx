import { useRef, useState, useEffect } from "react";
import { TransportersData } from "../../types";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import "./styles/Transport.css"
import Alert from '@mui/material/Alert';
import { TextField } from "@mui/material";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import firebaseApp from "../../firebase";
//import firebase storage
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { pdfjs } from 'react-pdf';
import { TextItem } from "pdfjs-dist/types/src/display/api";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


const AddTransportOrder = () => {

    const db = getDatabase(firebaseApp);
    const [transportista, setTransportista] = useState('');
    const [transList, setTransList] = useState<TransportersData[]>([]);
    const handleSelectChange = (event: SelectChangeEvent) => {
        setTransportista(event.target.value as string);

    };
    var mounted = false;

    //get transport list
    useEffect(() => {
        const transportRef = ref(db, "/transporters/");

        onValue(transportRef, (snapshot) => {
            const data = snapshot.val();

            let transportListTemp: TransportersData[] = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let transportOrder: TransportersData = {
                        id: data[key].id,
                        name: data[key].name,
                    }
                    transportListTemp.push(transportOrder);
                }
            }



            if (!mounted) {
                setTransList(transportListTemp);

            }


            // eslint-disable-next-line react-hooks/exhaustive-deps
            mounted = true;
        });
    }, [transList]);

    //set worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


    const [pdfText, setPdfText] = useState('');
    const [addressTxt, setAddressTxt] = useState('');
    const [clientNum, setClientNum] = useState('');
    const [fileTitle, setFileTitle] = useState('PUJAR PDF');
    const [firstTel, setFirstTel] = useState('');
    const [secondTel, setSecondTel] = useState('');
    const [error, setError] = useState('');
    const [observations, setObservations] = useState('');


    useEffect(() => {
        if (error) {
            console.log(error);
        }

    }, [error])

    useEffect(() => {
        let dadesDiv = document.querySelector(".dadesDiv") as HTMLDivElement;

        console.log(pdfText);

        //numero client
        const regex = /(\d+\n\s\n\d+\/\d+\/\d+\n\s\n)\d+/g;
        const match = pdfText.match(regex);
        if (match) {
            const regex2 = /\d+$/g;
            const match2 = match[0].match(regex2);
            if (match2) {
                setClientNum(match2[0]);
            }
        }

        //telefon 1
        const regex3 = /TEL\.\s*\n\s*(\d+\s?\d+\s?\d+\s?\d+\s)/g;
        //telefon 2
        const regex4 = /TEL2\.\s*\n\s*(\d+\s?\d+\s?\d+\s?\d+\s)/g;

        //get group 1 from pdfText regex3 match
        if (pdfText) {
            const match3 = pdfText.match(regex3);
            //split match3 by space and remove the first element
            if (match3) {


                const match3Split: string[] = match3?.[0]?.split(" ");
                match3Split.shift();
                //combine all elements in match3Split to a string
                const match3SplitString = match3Split.join(" ");
                console.log(match3SplitString)

                setFirstTel(match3SplitString);
            }



            //get group 1 from pdfText regex4 match

            //get group 1 from pdfText regex3 match

            const match4 = pdfText.match(regex4);
            //split match3 by space and remove the first element
            if (match4) {


                const match4Split: string[] = match4?.[0]?.split(" ");
                match4Split.shift();
                //combine all elements in match3Split to a string
                const match4SplitString = match4Split.join(" ");

                setSecondTel(match4SplitString);
            }

        }


     



        const startAddress = "CLIENTE:\nENVÍO:"
        const endAddress = "TEL2."

        const startAddressIndex = pdfText.indexOf(startAddress) + startAddress.length
        const endAddressIndex = pdfText.indexOf(endAddress)
        //direccio client
        let address = pdfText.substring(startAddressIndex, endAddressIndex).trim()


        let lines = address.split("\n") // split the text into an array of lines
        lines = lines.filter((line, index) => lines.indexOf(line) === index) // remove duplicates by keeping only the first occurrence of each line
        address = lines.join("\n") // join the lines back into a single string

        setAddressTxt(address) // prints address
        if (address !== "") {
            if (dadesDiv) {
                dadesDiv.style.visibility = "visible";
            }
        }

    }, [pdfText])

    const navigate = useNavigate();
    const [file, setFile] = useState<File | null | undefined>(null);

    //ejecutar useEffect cuando cambia el valor de file
    useEffect(() => {
        //read the text from PDF file


        if (file) {
            //get title from file
            const title = file.name;
            setFileTitle(title);
            const fileReader = new FileReader();
            fileReader.onload = (e) => {


                const arrayBuffer = e.target?.result as ArrayBuffer;
                if (pdfjs) {
                    pdfjs.getDocument({ data: arrayBuffer }).promise.then((pdf: { getPage: (arg0: number) => Promise<{ getTextContent: () => Promise<any>; }>; }) => {
                        pdf.getPage(1).then((page: { getTextContent: () => Promise<any>; }) => {
                            page.getTextContent().then((textContent) => {
                                const text = textContent.items.map((item: TextItem) => { return (item as TextItem).str }).join('\n');
                                setPdfText(text);
                            });

                        });
                    }).catch((err: Error) => {
                        setError(err.message);
                    });
                } else {
                    setError('pdfjs not loaded!');
                    return;
                }

            };
            fileReader.readAsArrayBuffer(file);
        }





    }, [file])

    const inputFileRef = useRef<HTMLInputElement>(null);
    const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        let fileInput = e.target.files?.item(0);
        setFile(fileInput);
    }
    const inputFileClick = () => {
        inputFileRef.current?.click();
    };



/*
    function copyData(data: string): void {
        navigator.clipboard.writeText(data);

        //show the Alert for 3 seconds (from hidden to visible)

        //select Alert element
        let alert = document.querySelector('.alert') as HTMLDivElement;
        if (alert) {
            alert.style.visibility = "visible";
            setTimeout(() => {
                alert.style.visibility = "hidden";
            }, 3000);
        }



    }
*/
    function uploadTransport(): void {
        //get realtime database ref and push

        try {

            try {
                //get firebaseStorage from firebase
                const storage = getStorage(firebaseApp);

                //upload the file to storage, no matter if imports are not specified
                var storageRef: any;
                try {
                    storageRef = refStorage(storage, 'transport/orders/' + fileTitle);
                } catch (error) {
                    console.log(error);
                }
                uploadBytesResumable(storageRef, file as Blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    //get download url
                    getDownloadURL(snapshot.ref).then((url) => {


                        try {
                            const dbRef = ref(db, 'transport');

                            const newTransportRef = push(dbRef);
                            //get key from newTransportRef
                            const key = newTransportRef.key;

                            //get transportista name from transList based on "transportista" id
                            let transName = "";
                            for (let i = 0; i < transList.length; i++) {
                                if (transList[i].id === transportista) {
                                    transName = transList[i].name;
                                }
                            }
                            set(newTransportRef, {
                                id: key,
                                clientNum: clientNum,
                                address: addressTxt,
                                firstTel: firstTel,
                                secondTel: secondTel,
                                observations: observations,
                                date: new Date().toLocaleDateString(),
                                time: new Date().toLocaleTimeString(),
                                status: "pendiente",
                                pdfUrl: url,
                                transId: transportista,
                                transName: transName
                            });
                        } catch (error: any) {
                            alert("error: " + error.message);
                        }


                    });
                });

            } catch (error: any) {
                setError(error.message);
                alert("Ja existeix un arxiu com aquest" + error.message);
            }





        } catch (error: any) {

            setError(error.message);
            console.log(error.message);

        }

        //navigate to transport page
        navigate('/transport');


    }

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <input type='file' name='file' id='file' ref={inputFileRef} onChangeCapture={onFileChangeCapture}
                style={{ display: 'none' }}
                accept="application/pdf"
                multiple={false} />
            <Navbar />
            <Alert className="alert" severity="success">Copiat</Alert>

            <div>
                <h1 style={{ textAlign: 'center' }}>Afegir comanda transport</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Pujar PDF</h3>
            <Button onClick={inputFileClick} variant="contained">{fileTitle}</Button>
            <div className="dadesDiv">
                <p><b></b></p>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Transportista</InputLabel>
                    <Select
                        value={transportista}
                        label="Transportista"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={handleSelectChange}
                    >
                        {/*Map transList */}
                        {transList.map((transportista) => {
                            return <MenuItem key={transportista.id} value={transportista.id}>{transportista.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <TextField style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Num. client"
                    rows={4}
                    value={clientNum}
                    variant="outlined"

                    onChange={(e) => setClientNum(e.target.value)}
                />
                {/*<p className="data"><b>Tel.:</b></p>
                <div onClick={() => copyData(firstTel)} className="box">
                    <p>{firstTel}</p>
                </div>*/}
                <TextField style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Telèfon"
                    rows={4}
                    value={firstTel}
                    variant="outlined"

                    onChange={(e) => setFirstTel(e.target.value)}
                />
                <TextField style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Telèfon 2"
                    rows={4}
                    value={secondTel}
                    variant="outlined"

                    onChange={(e) => setSecondTel(e.target.value)}
                />

                <TextField style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Direcció"
                    multiline
                    rows={4}
                    value={addressTxt}
                    variant="outlined"

                    onChange={(e) => setAddressTxt(e.target.value)}
                />
                {/*Input text multiline MUI*/}
                <TextField style={{ margin: "10px" }}
                    id="outlined-multiline-static"
                    label="Observacions"
                    multiline
                    rows={4}
                    defaultValue={observations}
                    variant="outlined"

                    onChange={(e) => setObservations(e.target.value)}
                />
                <Button onClick={() => uploadTransport()} variant="contained">Afegir comanda</Button>
            </div>


        </div>
    );
};

export default AddTransportOrder;


