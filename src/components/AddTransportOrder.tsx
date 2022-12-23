import { useRef, useState, useEffect } from "react";
import { Users } from "../types";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import "./styles/Transport.css"

import { pdfjs } from 'react-pdf';
import { TextItem } from "pdfjs-dist/types/src/display/api";


const AddTransportOrder = () => {

    //set worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


    const [pdfText, setPdfText] = useState('');
    const [addressTxt, setAddressTxt] = useState('');
    const [clientNum, setClientNum] = useState('');
    const [firstTel, setFirstTel] = useState('');
    const [secondTel, setSecondTel] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            console.log(error);
        }
        
    }, [error])

    useEffect(() => {
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
        const regex3 = /TEL\.\s*\n\s*(\d+)/g;
        //get group 1 from pdfText regex3 match
        const match3 = pdfText.match(regex3)?.[0]?.match(/\d+/g)?.[0];
        if (match3) {
            setFirstTel(match3);
        }
        //telefon 2
        const regex4 = /TEL2\.\s*\n\s*(\d+)/g;
        //get group 1 from pdfText regex4 match
        const match4 = pdfText.match(regex4)?.[0]?.match(/\d+/g)?.[1];
        if (match4) {
            setSecondTel(match4);
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

        setAddressTxt(address) // prints "BEARZUN S.A.\nPOLIGONO INDUSTRIAL ALBIASU\n31870\nLEKUNBERRI\n31870\nNAVARRA"
    }, [pdfText])

    const navigate = useNavigate();
    const [file, setFile] = useState<File | null | undefined>(null);

    //ejecutar useEffect cuando cambia el valor de file
    useEffect(() => {
        //read the text from PDF file


        if (file) {
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




    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <input type='file' name='file' id='file' ref={inputFileRef} onChangeCapture={onFileChangeCapture}
                style={{ display: 'none' }}
                accept="application/pdf"
                multiple={false} />
            <Navbar />
            <div>
                <h1 style={{ textAlign: 'center' }}>Afegir comanda transport</h1>
            </div>

            {/*Sepparate from Navbar 150px*/}

            <h3>Pujar PDF</h3>
            <Stack spacing={2} direction="column">
                <Button onClick={inputFileClick} variant="contained">Afegir comanda</Button>
                <p><b>Núm. client:</b> {clientNum}</p>
                <p><b>Tel.:</b> {firstTel}</p>
                <p><b>Tel. 2:</b> {secondTel}</p>
                <p><b>Direcció:</b> {addressTxt}</p>
            </Stack>


        </div >
    );
};

export default AddTransportOrder;