export const FormValidation = (fieldStatuses) => {
    return fieldStatuses.every(status => status.isValid);
};