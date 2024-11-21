export const SHOW_ERROR = "SHOW_ERROR"
export const SHOW_WARNING = "SHOW_WARNING"
export const SHOW_INFORMATION = "SHOW_INFORMATION"
export const SHOW_SUCCESS = "SHOW_SUCCESS"
export const CLOSE_ALERT = "CLOSE_ALERT"


const initialState = {
    isOpen: false,
    message: "",
    severity: ""
};


const alertStore = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_INFORMATION:
            return {
                isOpen: true,
                message: action.payload,
                severity: "neutral"
            }
        case SHOW_ERROR:
            return {
                isOpen: true,
                message: action.payload,
                severity: "danger"
            }
        case SHOW_WARNING:
            return {
                isOpen: true,
                message: action.payload,
                severity: "warning"
            }
        case SHOW_SUCCESS:
            return {
                isOpen: true,
                message: action.payload,
                severity: "success"
            }

        case CLOSE_ALERT:
            return {
                ...state,
                isOpen: false
            }
        default:
            return state;

    }
}


export default alertStore;