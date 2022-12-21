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
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            console.log(error);
        }
        
    }, [error])

    useEffect(() => {

        const start = "CLIENTE:\nENVÍO:"
        const end = "TEL2."

        const startIndex = pdfText.indexOf(start) + start.length
        const endIndex = pdfText.indexOf(end)

        let address = pdfText.substring(startIndex, endIndex).trim()


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
                <p><b>Direcció:</b> {addressTxt}</p>
            </Stack>


        </div >
    );
};

export default AddTransportOrder;