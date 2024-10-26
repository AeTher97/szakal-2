const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }
    return hash;
}

const intToRGB = (i, opacity = 0.7) => {
    const red = (i >> 16) & 0xFF;
    const green = (i >> 8) & 0xFF;
    const blue = i & 0xFF;
    return `rgba(${red},${green},${blue},${opacity})`;
}

export const uuidToColor = (uuid, opacity = 0.7) => {
    const hash = hashCode(uuid);
    return intToRGB(hash, opacity);
}