import {
    LOGIN_ATTEMPT,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT,
    REFRESH_ATTEMPT,
    REFRESH_SUCCESS,
    TOKEN_SWITCHED_BY_ANOTHER_TAB,
    UPDATE_ACCESS_RIGHTS
} from "./AuthStore";
import {decodeToken, saveInfoInStorage} from "../utils/JwtTokenUtils";
import {showError} from "./AlertActions";
import {defaultAxiosInstance} from "../data/AxiosWithoutAuth";

const updateAccessRights = (user, authToken, dispatch) => {
    return defaultAxiosInstance.get("/roles", {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then((res) => {
        const userAccessRights = res.data
            .filter(role => user.roles.includes(role.id))
            .flatMap(role => {
                return role.accessRights.map(accessRight => accessRight.code);
            })
        const uniqueAccessRights = [...new Set(userAccessRights)];
        dispatch(setAccessRightsAction(uniqueAccessRights))
    })
}

export const loginAction = ({username, password}, onSuccessCallback = () => null) => dispatch => {
    dispatch({type: LOGIN_ATTEMPT});

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);


    return defaultAxiosInstance.post('/login', formData)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken
            };

            dispatch({type: LOGIN_SUCCESS, payload: payload});
            const user = decodeToken(data.authToken);
            saveInfoInStorage(data.authToken, payload.userId, user.email, user.name, user.surname);
            onSuccessCallback({accepted: data.accepted, authToken: data.authToken});
            updateAccessRights(user, data.authToken, dispatch)
            return data.accepted
        })
        .catch(err => {
            console.error('Login unsuccessful');
            console.error(err.response)
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                dispatch({type: LOGIN_FAILED, error: "Invalid username or password"});
                dispatch(showError("Nieprawidłowy email lub hasło"));
            } else dispatch(showError(err.message))
        });
};

export const refreshAction = () => dispatch => {
    dispatch({type: REFRESH_ATTEMPT});

    return defaultAxiosInstance.post('/refresh', null)
        .then(({data}) => {
            const payload = {
                ...decodeToken(data.authToken),
                accessToken: data.authToken,
            };

            dispatch({type: REFRESH_SUCCESS, payload: payload});
            updateAccessRights(decodeToken(data.authToken), data.authToken, dispatch)
            return data;
        });
};

export const setAccessRightsAction = (accessRights) => dispatch => {
    dispatch({type: UPDATE_ACCESS_RIGHTS, payload: {accessRights}})
}

export const logoutAction = () => dispatch => {
    dispatch({type: LOGOUT});
}

export const tokenSwitchedByAnotherTabAction = (accessToken, expirationTime) => dispatch => {
    dispatch({type: TOKEN_SWITCHED_BY_ANOTHER_TAB, payload: {accessToken, expirationTime}});
}
