import React, {useEffect, useState} from 'react';
import {Autocomplete, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Select, Stack} from "@mui/joy";
import {useAddScheduledContact} from "../../data/NotificationData";
import Button from "@mui/joy/Button";
import {useSelector} from "react-redux";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import Option from "@mui/joy/Option";
import PropTypes from "prop-types";
import {InputWithLimit} from "./InputWithLimit";
import {UseFieldValidation} from "../../utils/UseFieldValidation";

const contactReminderOptions = [
    {label: "2 dni przed", value: 48},
    {label: "1 dzień przed", value: 24},
    {label: "12 godzin przed", value: 12},
    {label: "6 godzin przed", value: 6},
    {label: "3 godziny przed", value: 3},
    {label: "Własne", value: 0}
]

const hour = 60 * 60 * 1000;

const dateToLocalISO = (date) => {
    const off = date.getTimezoneOffset()
    return (new Date(date.getTime() - off * 60 * 1000).toISOString().slice(0, 23))
}

const ScheduledContactDialog = ({open, close}) => {

    const {addScheduledContact} = useAddScheduledContact();
    const {currentCampaign} = useSelector(state => state.campaigns);

    const [companySearch, setCompanySearch] = useState("");
    const [searchObject, setSearchObject] = useState({});

    const {companies, loading: companiesLoading}
        = useCompanyListWithCampaign(currentCampaign, searchObject,
        [(currentCampaign !== '') ? true : null, open], 0);
    const {userId} = useSelector(state => state.auth);
    const {theme} = useSelector(state => state.theme);

    const [beforeSelect, setBeforeSelect] = useState(24);
    const [company, setCompany] = useState("");
    const [contactDate, setContactDate] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const note = UseFieldValidation();

    const isFormValid = note.isValid;

    useEffect(() => {
        if (companySearch !== "") {
            setSearchObject({name: companySearch})
        } else {
            setSearchObject({})
        }
    }, [companySearch]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Zaplanuj kontakt</DialogTitle>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (beforeSelect !== 0) {
                        const tempDate = new Date()
                        tempDate.setTime(new Date(contactDate).getTime() - hour * beforeSelect);
                        addScheduledContact(company.id, userId, contactDate, dateToLocalISO(tempDate), note.value)
                            .then(() => {
                                close();
                            });
                    } else {
                        addScheduledContact(company.id, userId, contactDate, reminderDate, note.value).then(() => {
                            close();
                        });
                    }
                }}>
                    <Stack spacing={2}>
                        <FormControl required autoFocus>
                            <FormLabel>Firma</FormLabel>
                            <Autocomplete
                                loading={companiesLoading}
                                loadingText={"Wczytywanie..."}
                                noOptionsText={"Brak wyników"}
                                placeholder={"ACME z.o.o"}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onInputChange={(e, value) => {
                                    setCompanySearch(value);
                                }}
                                onChange={(e, value) => {
                                    setCompany(value);
                                }}
                                inputValue={companySearch}
                                options={companies.map(company => {
                                    return {
                                        id: company.id,
                                        label: company.name
                                    }
                                })}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Data i godzina</FormLabel>
                            <Input type={"datetime-local"}
                                   style={{colorScheme: theme}}
                                   value={contactDate} onChange={(e) => {
                                setContactDate(e.target.value)
                            }}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Przypomnij</FormLabel>
                            <Select value={beforeSelect} onChange={(e, value) => {
                                setBeforeSelect(value)
                            }}>
                                {contactReminderOptions.map((option =>
                                    <Option key={option.value} value={option.value}>{option.label}</Option>))}
                            </Select>
                        </FormControl>
                        {beforeSelect === 0 && <FormControl required={beforeSelect === 0}>
                            <FormLabel>Data i godzina przypomnienia</FormLabel>
                            <Input type={"datetime-local"}
                                   style={{colorScheme: theme}}
                                   value={reminderDate} onChange={(e) => {
                                setReminderDate(e.target.value)
                            }}/>
                        </FormControl>}
                        <FormControl>
                            <FormLabel>Notatka</FormLabel>
                            <InputWithLimit
                                placeholder={"Notatka"}
                                value={note.value}
                                limit={note.limit}
                                isValid={note.isValid}
                                onChange={note.handleChange}/>
                        </FormControl>
                        <Button type={"submit"} disabled={!isFormValid}>
                            Zapisz
                        </Button>
                        <Button onClick={close} variant={"outlined"} color={"neutral"}>
                            Anuluj
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

ScheduledContactDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
}

export default ScheduledContactDialog;