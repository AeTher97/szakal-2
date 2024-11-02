import React, {useState} from 'react';
import {FormControl, FormHelperText, FormLabel, Input, Textarea} from "@mui/joy";
import {InfoOutlined} from "@mui/icons-material";

const InputWithLimit = ({
                            limit = 255,
                            onChange = () => {
                            },
                            required,
                            label,
                            formControlProps,
                            ...props
                        }) => {

    const [length, setLength] = useState(0);

    return (
        <FormControl {...formControlProps} required={required} error={length > limit}>
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
    },
                                      formControlProps,
                                      ...props
                                  }) => {

    const [length, setLength] = useState(0);

    return (
        <FormControl {...formControlProps} error={length > limit}>
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