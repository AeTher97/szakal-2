export const UseFormValidation = (fieldStatuses) => {
    return fieldStatuses.every(status => status.isValid);
};