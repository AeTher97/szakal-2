import {useState} from "react";
import axios from "axios";

export const useRegister = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const registerUser = (user) => {
        return axios.post('/users', user)
    }
    return {registerUser}
}