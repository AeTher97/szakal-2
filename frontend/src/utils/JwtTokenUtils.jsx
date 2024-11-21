import {jwtDecode} from "jwt-decode";

const errorString = 'Log out occurred, please log in again';
export const decodeToken = (accessToken) => {
    try {
        const {
            sub,
            roles,
            email,
            name,
            surname,
            exp
        } = jwtDecode(accessToken);

        return {
            userId: sub,
            roles: roles,
            expirationTime: exp,
            email: email,
            name: name,
            surname: surname
        };
    } catch (e) {
        return {
            error: errorString
        };
    }
}

export const saveInfoInStorage = (accessToken, userId, email, name, surname) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('surname', surname);
}

export const clearLocalStorage = () => {
    localStorage.removeItem("email")
    localStorage.removeItem("name")
    localStorage.removeItem("surname")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("accessRights")
}

export const saveAccessRightsInStorage = (accessRights) => {
    localStorage.setItem('accessRights', accessRights.join(","));
}


export const isTokenOutdated = (exp) => {
    return exp - 10 < (new Date().getTime() / 1000);
}

export const getAuthHeader = (token) => {
    return `Bearer ${token}`;
}

