export const cookieExists = (name) => {
    const cookies = document.cookie.split(';');
    const cookieNames = cookies.map(cookie => cookie.split('=')[0].trim())

    console.log(cookies)
    return !!(cookieNames.includes(name));
}