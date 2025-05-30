import React, {useState} from 'react';
import {
    Autocomplete,
    AutocompleteOption,
    createFilterOptions,
    ListItemContent,
    ListItemDecorator,
    Typography
} from "@mui/joy";
import UserAvatar from "./UserAvatar";
import {useUsersSearch} from "../../data/UsersData";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";

const UserAutocomplete = ({
    setUser = () => {
    },
    ignoreIds = [],
    ignoreSelf = true,
    clearOnSelect = false
}) => {

    const [userSearch, setUserSearch] = useState("");
    const [value, setValue] = useState(null);

    const { users, loading } = useUsersSearch(userSearch);
    const { userId } = useSelector(state => state.auth);

    const filterOptions = createFilterOptions({
        matchFrom: 'any',
        stringify: (option) => option.label + option.email
    });

    const ignoredIdsList = ignoreIds;

    if (ignoreSelf) {
        ignoredIdsList.push(userId);
    }

    return (
        <Autocomplete
            loading={loading}
            disableClearable
            loadingText={"Wczytywanie..."}
            noOptionsText={"Brak wyników..."}
            placeholder={"Imie i nazwisko lub email"}
            inputValue={userSearch}
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={filterOptions}
            onInputChange={(e, value) => {
                setUserSearch(value);
            }}
            onChange={(e, value) => {
                setUser(value);
                if (clearOnSelect) {
                    setValue(null);
                    setUserSearch("")
                } else {
                    setValue(value);
                }
            }}
            options={users ? users
                .filter(user => !ignoredIdsList.includes(user.id))
                .map(user => {
                    return {
                        label: `${user.name} ${user.surname} ${user.email}`,
                        visibleLabel: `${user.name} ${user.surname}`,
                        name: user.name,
                        surname: user.surname,
                        id: user.id,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        committee: user.committee
                    }
                }) : []}
            renderOption={(props, option) => (
                <AutocompleteOption {...props}>
                    <ListItemDecorator style={{ marginInlineEnd: 5 }}>
                        <UserAvatar id={option.id} name={option.name} surname={option.surname}
                                    image={option.profilePicture}
                            text={false} />
                    </ListItemDecorator>
                    <ListItemContent sx={{ fontSize: 'sm' }}>
                        {option.visibleLabel}
                        <Typography level="body-xs">
                            {option.email}
                        </Typography>
                        <Typography level="body-xs">
                            {option.committee}
                        </Typography>
                    </ListItemContent>
                </AutocompleteOption>
            )}
        />
    );
};

UserAutocomplete.propTypes = {
    setUser: PropTypes.func.isRequired,
    ignoreIds: PropTypes.array,
    ignoreSelf: PropTypes.bool,
    clearOnSelect: PropTypes.bool
}

export default UserAutocomplete;