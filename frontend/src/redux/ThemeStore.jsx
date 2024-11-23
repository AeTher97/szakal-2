export const SWITCH_THEME = "SWITCH_THEME"

const getThemeFromStorage = () => {
    return localStorage.getItem("joy-mode") === "light" ? "light" : "dark";
}

const themeInitialState = {
    theme: getThemeFromStorage()
};

export function themeReducer(state = themeInitialState, action) {
    if (action.type === SWITCH_THEME) {
        return {
            theme: state.theme === "light" ? "dark" : "light"
        }
    } else {
        return state;
    }
}