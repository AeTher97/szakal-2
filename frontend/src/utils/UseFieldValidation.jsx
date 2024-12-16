import {useState} from "react";

export const UseFieldValidation = (initialValue = "", limit = 255, validation = () => true) => {
    const [value, setValue] = useState(initialValue);
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        setIsValid(newValue.length <= limit && validation(newValue));
    };

    const reset = () => {
        setValue("");
        setIsValid(true);
    };

    return {value, isValid, limit, handleChange, reset, setValue};
};
