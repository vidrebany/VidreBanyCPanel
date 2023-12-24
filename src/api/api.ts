import axios from "axios";
import { toast } from "react-toastify";

// Create an instance of axios
export const Api = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		"Content-Type": "application/json",
		// "Cross-Origin-Opener-Policy": "same-origin",
	},
	maxBodyLength: 5 * 1024 * 1024 * 1024, // 5GB
});

Api.interceptors.response.use(
	(res) => res,
	(err: any) => {
		const error = err.response?.data.error;

		if (
			
			err.response?.status === 401 &&
			error
		) {
            toast.error("Error en la petición:",error);
		}
		return Promise.reject(err);
	}
);

