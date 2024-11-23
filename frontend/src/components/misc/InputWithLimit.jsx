import React, {useState} from 'react';
import {FormControl, FormHelperText, FormLabel, Input, Textarea} from "@mui/joy";
import {InfoOutlined} from "@mui/icons-material";
import PropTypes from "prop-types";

export const InputWithLimit = ({
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

InputWithLimit.propTypes = {
    limit: PropTypes.number,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    label: PropTypes.string,
    formControlProps: PropTypes.object
}

export const TextAreaWithLimit = ({
                                      limit = 255,
                                      onChange = () => {
                                      },
                                      formControlProps,
                                      required,
                                      ...props
                                  }) => {

    const [length, setLength] = useState(0);

    return (
        <FormControl {...formControlProps} error={length > limit} required={required}>
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

TextAreaWithLimit.propTypes = {
    limit: PropTypes.number,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    formControlProps: PropTypes.object
}
