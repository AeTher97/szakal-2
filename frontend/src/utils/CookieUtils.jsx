export const cookieExists = (name) => {
    const cookies = document.cookie.split(';');
    const cookieNames = cookies.map(cookie => cookie.split('=')[0].trim())

    return !!(cookieNames.includes(name));
}
