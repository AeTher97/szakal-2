export const removeNullFields = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === '') {
            delete obj[key];
        }
    });
    return obj;
}