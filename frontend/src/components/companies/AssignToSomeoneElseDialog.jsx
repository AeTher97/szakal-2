import React, {useState} from 'react';
import {
    Autocomplete, AutocompleteOption,
    createFilterOptions,
    DialogTitle,
    FormControl,
    FormLabel, ListItemContent, ListItemDecorator,
    Modal,
    ModalDialog,
    Stack, Typography
} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useUsersSearch} from "../../data/UsersData";
import {useSelector} from "react-redux";
import UserAvatar from "../UserAvatar";

const AddContactPersonDialog = ({open, close, addJourney, currentCampaign, companyId, navigate}) => {

    const [userSearch, setUserSearch] = useState("");
    const [user, setUser] = useState(null);
    const {users, loading} = useUsersSearch(userSearch);
    const {userId} = useSelector(state => state.auth);

    const clear = () => {
        setUser("")
    }

    const filterOptions = createFilterOptions({
        matchFrom: 'any',
        stringify: (option) => option.label + option.email
    });


    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Przypisz firmę do osoby</DialogTitle>
                <form onSubmit={(event, value) => {
                    event.preventDefault();
                    if (!user) {
                        return;
                    }
                    addJourney(currentCampaign, companyId, user.id)
                        .then((data) => {
                            clear()
                            navigate(`/secure/journeys/${data.id}`)
                        })
                }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Użytkownik do przypisania</FormLabel>
                            <Autocomplete
                                loading={loading}
                                disableClearable
                                loadingText={"Wczytywanie..."}
                                noOptionsText={"Brak wyników..."}
                                placeholder={"Imie i nazwisko lub email"}
                                inputValue={userSearch}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                filterOptions={filterOptions}
                                onInputChange={(e, value) => {
                                    setUserSearch(value);
                                }}
                                onChange={(e, value) => {
                                    setUser(value);
                                }}
                                options={users
                                    .filter(user=> user.id !== userId)
                                    .map(user => {
                                    return {
                                        label: `${user.name} ${user.surname}`,
                                        name: user.name,
                                        surname: user.surname,
                                        id: user.id,
                                        email: user.email,
                                        image: `data:image;base64,${user.profilePicture}`
                                    }
                                })}
                                renderOption={(props, option) => (
                                    <AutocompleteOption {...props}>
                                        <ListItemDecorator style={{marginInlineEnd: 5}}>
                                            <UserAvatar name={option.name} surname={option.surname} image={option.image} text={false}/>
                                        </ListItemDecorator>
                                        <ListItemContent sx={{ fontSize: 'sm' }}>
                                            {option.label}
                                            <Typography level="body-xs">
                                                {option. email}
                                            </Typography>
                                        </ListItemContent>
                                    </AutocompleteOption>
                                )}
                            />
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={() => {
                            clear()
                            close()
                        }}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
        ;
};

export default AddContactPersonDialog;