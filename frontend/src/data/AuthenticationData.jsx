import {defaultAxiosInstance} from "../redux/ReducerActions";

export const useRegister = () => {

    const registerUser = (user) => {
        return defaultAxiosInstance.post('/users', user)
    }
    return {registerUser}
}