export const formatLocalDateTime = (localDateTime) => {
    return new Date(localDateTime).toLocaleString("pl");
}

export const formatLocalDate = (localDate) => {
    return new Date(localDate).toLocaleDateString("pl");
}