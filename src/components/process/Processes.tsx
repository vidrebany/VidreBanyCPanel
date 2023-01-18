import { useEffect, useState } from "react";
import { Users } from "../../types";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";


const Processes = () => {
  const navigate = useNavigate();

  const processesList = ["Admin", "Cajones", "Canteado", "Corte", "Laca", "Mecanizado", "Montaje", "Uñero"]



  return (
    <div>
      <Navbar />
      <div>
        <h1 style={{ textAlign: 'center' }}>Escollir procés:</h1>
      </div>

      {/*Sepparate from Navbar 150px*/}
      <div style={{ marginTop: '150px' }}>

        {processesList.map((value, index) => {
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
                borderRadius: '15px',
                border: '2px solid white',
                padding: '10px',
                margin: '10px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/process', { state: { number: value} })}
            >
              <p>{value}</p>
            </div>

          );
        })}
      </div>
    </div >
  );
};

export default Processes;