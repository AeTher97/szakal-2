export const formatLocalDateTime = (localDateTime) => {
    return new Date(localDateTime).toLocaleString("pl", {
        hour: "2-digit", minute: "2-digit", year: "numeric", month: "numeric", day: "numeric"
    });
}

export const formatLocalDate = (localDate) => {
    return new Date(localDate).toLocaleDateString("pl");
}