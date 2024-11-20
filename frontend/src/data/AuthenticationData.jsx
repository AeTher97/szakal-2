import {defaultAxiosInstance} from "../redux/ReducerActions";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {showError} from "../redux/AlertActions";

export const useRegister = () => {

    const registerUser = (user) => {
        return defaultAxiosInstance.post('/users', user)
    }
    return {registerUser}
}


export const usePasswordReset = () => {

    const dispatch = useDispatch();
    const [resetLoading, setResetLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false);

    const resetPassword = (email) => {
        setResetLoading(true);
        return defaultAxiosInstance.post("/users/reset-password", {
            email
        }).catch(e => {
            if (e.response?.data?.error) {
                console.error(e.response.data.error);
                dispatch(showError(e.response.data.error))
            }
            throw e;
        }).finally(() => {
            setResetLoading(false);
        })
    }

    const updatePassword = (password, repeatPassword, code) => {
        setUpdateLoading(true);
        return defaultAxiosInstance.post("/users/reset-password-set-new", {
            password,
            repeatPassword,
            code
        }).catch(e => {
            if (e.response?.data?.error) {
                console.error(e.response.data.error);
                dispatch(showError(e.response.data.error))
            }
            throw e;
        }).finally(() => {
            setUpdateLoading(false);
        })
    }

    return {resetPassword, updatePassword, resetPasswordLoading: resetLoading, updatePasswordLoading: updateLoading}
}