import { initializeApp } from 'firebase/app'; // Importa initializeApp de 'firebase/app'
import { getDatabase } from 'firebase/database'; // Importa getDatabase de 'firebase/database'
import firebase from 'firebase/app';
import 'firebase/database';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAnIKwnYcr4il7u4WEfT0NLx8xSVOOQ-EY",
    authDomain: "vidrebany-783d3.firebaseapp.com",
    databaseURL: "https://vidrebany-783d3-default-rtdb.firebaseio.com",
    projectId: "vidrebany-783d3",
    storageBucket: "vidrebany-783d3.appspot.com",
    messagingSenderId: "565844205082",
    appId: "1:565844205082:web:3a5fc1e7c41e451a533ba3",
    measurementId: "G-KBKPDW4Z3V"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obtiene una instancia de la base de datos
const database = getDatabase(app);

// Exporta la instancia de la base de datos
export default database;