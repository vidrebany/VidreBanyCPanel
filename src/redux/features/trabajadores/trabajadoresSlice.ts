import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trabajador } from '../../../components/control-horari/trabajadores/types/trabajadoresTypes';

interface TrabajadoresState {
    trabajadores: Trabajador[]
    selectedTrabajador?: Trabajador | null
}

const initialState: TrabajadoresState = {
    trabajadores: [],
    selectedTrabajador: null
}

export const trabajadoresSlice = createSlice({
    name: 'trabajadores',
    initialState,
    reducers: {
        setTrabajadores: (state, action: PayloadAction<Trabajador[]>) => {
            state.trabajadores = action.payload;
        },
        addTrabajador: (state, action: PayloadAction<Trabajador>) => {
            state.trabajadores.push(action.payload);
        },
        removeTrabajador: (state, action: PayloadAction<string>) => {
            state.trabajadores = state.trabajadores.filter(trabajador => trabajador.code !== action.payload);
        },
        modifyTrabajador: (state, action: PayloadAction<Trabajador>) => {
            const index = state.trabajadores.findIndex(trabajador => trabajador.code === action.payload.code);
            if (index !== -1) {
                state.trabajadores[index] = { ...state.trabajadores[index], ...action.payload };
            } else {
                // Optionally handle the case where the trabajador doesn't exist
                console.warn("Attempted to modify a trabajador that doesn't exist");
            }
        },
        setSelectedTrabajador: (state, action: PayloadAction<Trabajador>) => {
            state.selectedTrabajador = action.payload;
        }
    }
});

export const { setTrabajadores, addTrabajador, removeTrabajador, modifyTrabajador, setSelectedTrabajador } = trabajadoresSlice.actions;

export default trabajadoresSlice.reducer;