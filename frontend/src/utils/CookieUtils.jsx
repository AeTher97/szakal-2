export const cookieExists = (name) => {
    const cookies = document.cookie.split(';');
    const cookieNames = cookies.map(cookie => cookie.split('=')[0].trim())

    return !!(cookieNames.includes(name));
}

export const getCookieValue = (name) => {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(cookie => cookie.split('=')[0].trim() === name)
    if (!cookie) {
        return null;
    } else {
        return cookie.split("=")[1].trim();
    }
}