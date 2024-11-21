import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const defaultAxiosInstance = axios.create(
    {
        baseURL: baseURL,
        withCredentials: true
    }
)