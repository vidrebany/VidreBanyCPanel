import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Api } from "../api/api"; // import your API instance
import { Trabajador } from "../components/control-horari/trabajadores/types/trabajadoresTypes";
import { setTrabajadores } from "../redux/features/trabajadores/trabajadoresSlice";

const useFetchWorkers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await Api.get<Trabajador[]>('/workers');
                dispatch(setTrabajadores(response.data));
            } catch (error) {
                // Handle error
                console.error("Failed to fetch workers", error);
            }
        };

        fetchWorkers();
    }, [dispatch]); // Run once on component mount

    // You can return anything you might need from this hook
};

export default useFetchWorkers;