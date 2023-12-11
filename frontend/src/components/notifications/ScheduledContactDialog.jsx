import React, {useState} from 'react';
import {Autocomplete, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import {useAddScheduledContact} from "../../data/NotificationData";
import Button from "@mui/joy/Button";
import {useSelector} from "react-redux";
import {useCompanyListWithCampaign} from "../../data/CompaniesData";

const ScheduledContactDialog = ({open, close}) => {

    const {loading, addScheduledContact} = useAddScheduledContact();
    const {currentCampaign} = useSelector(state => state.campaigns);

    const [companySearch, setCompanySearch] = useState("");

    const {companies, loading : companiesLoading}
        = useCompanyListWithCampaign(currentCampaign, 0, companySearch)
    const {userId} = useSelector(state => state.auth);
    const {theme} = useSelector(state => state.theme);


    const [company, setCompany] = useState("");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Zaplanuj kontakt</DialogTitle>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    addScheduledContact(company.id, userId, date, note).then(() => {
                        close();
                    });
                }}>
                    <Stack spacing={2}>
                        <FormControl required autoFocus>
                            <FormLabel>Firma</FormLabel>
                            <Autocomplete
                                loading={companiesLoading}
                                loadingText={"Wczytywanie..."}
                                noOptionsText={"Brak wyników"}
                                placeholder={"ACME z.o.o"}
                                onInputChange={(e,value) => {
                                    setCompanySearch(value);
                                }}
                                onChange={(e, value) => {
                                    setCompany(value);
                                }}
                                inputValue={companySearch}
                                options={companies.map(company => {
                                return {
                                    label: company.name,
                                    id: company.id
                                }
                            })}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Data i godzina</FormLabel>
                            <Input type={"datetime-local"}
                                   style={{colorScheme: theme}}
                                   value={date} onChange={(e) => {
                                setDate(e.target.value)
                            }}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Notatka</FormLabel>
                            <Input placeholder={"Notatka"}
                                   value={note} onChange={(e) => {
                                setNote(e.target.value)
                            }}/>
                        </FormControl>
                        <Button type={"submit"}>
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

export default ScheduledContactDialog;