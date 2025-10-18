import React from 'react';
import {FormControl, FormHelperText, FormLabel, Input, Textarea} from "@mui/joy";
import {InfoOutlined} from "@mui/icons-material";
import PropTypes from "prop-types";

export const InputWithLimit = ({
                                   limit,
                                   onChange = () => {
                                   },
                                   required,
                                   label,
                                   formControlProps,
                                   isValid = true,
                                   testId = "",
                                   ...props
                               }) => {

    return (
        <FormControl {...formControlProps} error={!isValid}>
            <FormLabel>{label}</FormLabel>
            <Input {...props} slotProps={{input: {"data-testid": testId}}} onChange={onChange} required={required}/>
            {!isValid && <FormHelperText>
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
    formControlProps: PropTypes.object,
    isValid: PropTypes.bool,
    testId: PropTypes.string,
}

export const TextAreaWithLimit = ({
                                      limit,
                                      onChange = () => {
                                      },
                                      formControlProps,
                                      required,
                                      isValid = true,
                                      label,
                                      ...props
                                  }) => {

    return (
        <FormControl {...formControlProps} error={!isValid}>
            <FormLabel>{label}</FormLabel>
            <Textarea {...props} onChange={onChange} required={required}/>
            {!isValid && <FormHelperText>
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
    formControlProps: PropTypes.object,
    isValid: PropTypes.bool
}