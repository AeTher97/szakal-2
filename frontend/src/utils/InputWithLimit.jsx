import React, {useState} from 'react';
import {FormControl, FormHelperText, FormLabel, Input, Textarea} from "@mui/joy";
import {InfoOutlined} from "@mui/icons-material";

const InputWithLimit = ({
                            limit = 255,
                            onChange = () => {
                            },
                            required,
                            label,
                            ...props
                        }) => {

    const [length, setLength] = useState(0);

    return (
        <FormControl required={required} error={length > limit}>
            <FormLabel>{label}</FormLabel>
            <Input {...props} onChange={(e) => {
                setLength(e.target.value.length);
                onChange(e);
            }}/>
            {length > limit && <FormHelperText>
                <InfoOutlined/>
                Maksymalna liczba znaków to {limit}
            </FormHelperText>}
        </FormControl>
    );
};

export const TextAreaWithLimit = ({
                                      limit = 255, onChange = () => {
    }, ...props
                                  }) => {

    const [length, setLength] = useState(0);

    return (
        <FormControl error={length > limit}>
            <Textarea {...props} onChange={(e) => {
                setLength(e.target.value.length);
                onChange(e);
            }}/>
            {length > limit && <FormHelperText>
                <InfoOutlined/>
                Maksymalna liczba znaków to {limit}
            </FormHelperText>}
        </FormControl>
    );
};

export default InputWithLimit;