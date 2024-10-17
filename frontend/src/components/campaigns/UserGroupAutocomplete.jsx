import React, {useState} from 'react';
import {Autocomplete} from "@mui/joy";
import {useGroupsList} from "../../data/GroupsData";

const CHOOSE_VALUE = {id: "choose", label: "Wybierz", disabled: true};

const UserGroupAutocomplete = ({onChange}) => {

    const [inputValue, setInputValue] = useState(CHOOSE_VALUE.label);
    const [value, setValue] = useState(CHOOSE_VALUE);

    const getOptionDisabled = (option) => {
        return option.disabled
    }

    const isOptionEqualToValue = (option, value) => {
        return value.id === option.id
    }

    const {groups, loading} = useGroupsList();

    const groupsOptions = groups && groups.map((campaign) => {
        return {
            label: campaign.name,
            id: campaign.id
        }
    });
    groupsOptions.push(CHOOSE_VALUE)


    return (
        <Autocomplete loading={loading}
                      value={value}
                      disableClearable
                      options={groupsOptions}
                      getOptionDisabled={getOptionDisabled}
                      isOptionEqualToValue={isOptionEqualToValue}
                      inputValue={inputValue}
                      onInputChange={(e, value) => {
                          setInputValue(value)
                      }}
                      onChange={(e, newValue) => {
                          setValue(newValue);
                          onChange(newValue);
                      }}
        />
    );
};

export default UserGroupAutocomplete;