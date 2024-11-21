import {CLOSE_ALERT, SHOW_ERROR, SHOW_INFORMATION, SHOW_SUCCESS, SHOW_WARNING} from "./AlertStore";


export const showSuccess = (message) => dispatch => {
    dispatch({type: SHOW_SUCCESS, payload: message});
}

export const showError = (message) => dispatch => {
    dispatch({type: SHOW_ERROR, payload: message});
}


export const showWarning = (message) => dispatch => {
    dispatch({type: SHOW_WARNING, payload: message});
}


export const showInfo = (message) => dispatch => {
    dispatch({type: SHOW_INFORMATION, payload: message});
}

export const closeAlert = () => dispatch => {
    dispatch({type: CLOSE_ALERT})
}
