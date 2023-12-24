import { createAction } from "@reduxjs/toolkit";
import { Trabajador } from "../../../components/control-horari/trabajadores/types/trabajadoresTypes";

export const fetchTrabajadoresAction = createAction<Trabajador[]>(
    "mystorage/fetch-trabajadores"
);