import axios from "axios";

export const useRegister = () => {

    const registerUser = (user) => {
        return axios.post('/users', user)
    }
    return {registerUser}
}