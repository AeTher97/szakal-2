const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }
    return hash;
}

const intToRGB = (i) => {
    const red = (i >> 16) & 0xFF;
    const green = (i >> 8) & 0xFF;
    const blue = i & 0xFF;
    return {red, green, blue};
}

const ensureContrast = (rgb) => {
    const luminance = (0.2126 * rgb.red + 0.7152 * rgb.green + 0.0722 * rgb.blue) / 255;

    if (luminance > 0.8) {
        return {
            red: Math.max(0, rgb.red - 50),
            green: Math.max(0, rgb.green - 50),
            blue: Math.max(0, rgb.blue - 50),
        };
    }

    return rgb;
};

const rgbToRGBA = ({red, green, blue}, opacity) => {
    return `rgba(${red},${green},${blue},${opacity})`;
};

export const uuidToColor = (uuid, opacity = 0.7) => {
    const hash = hashCode(uuid);
    const baseColor = intToRGB(hash);
    const contrastedColor = ensureContrast(baseColor);
    return rgbToRGBA(contrastedColor, opacity);
}