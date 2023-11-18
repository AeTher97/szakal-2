import {jwtDecode} from "jwt-decode";

const errorString = 'Log out occurred, please log in again';
export const decodeToken = (accessToken) => {
    try {
        const {
            sub,
            roles,
            email,
            username,
            name,
            surname,
            exp
        } = jwtDecode(accessToken);

        return {
            userId: sub,
            roles: roles,
            expirationTime: exp,
            email: email,
            username: username,
            name: name,
            surname: surname
        };
    } catch (e) {
        return {
            error: errorString
        };
    }
}

export const saveTokenInStorage = (accessToken, refreshToken, email, username, name, surname) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('name', name);
    localStorage.setItem('surname', surname);
}

export const saveAccessRightsInStorage = (accessRights) => {
    localStorage.setItem('accessRights', accessRights.join(","));
}

export const saveUserParametersInStorage = (email, username, name, surname) => {
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('name', name);
    localStorage.setItem('surname', surname);
}

export const isTokenOutdated = (exp) => {
    return exp - 10 < (new Date().getTime() / 1000);
}

export const getHeaders = (token) => {
    return `Bearer ${token}`;

}

