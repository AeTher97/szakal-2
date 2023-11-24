import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import CompanyCategories from "./CompanyCategories";

const AddCampaignDialog = ({open, close, addCompany}) => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [www, setWww] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [categories, setCategories] = useState([]);

    const onClose = () => {
        setName("");
        setPhone("");
        setEmail("");
        setWww("");
        setStreet("");
        setCity("");
        setPostalCode("");
        setCategories("");
        close();
    }

    return (
        <Modal open={open}>
            <ModalDialog sx={{overflow: "auto"}}>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        addCompany(name,
                            phone,
                            email,
                            www,
                            categories.map(category => category.id),
                            street,
                            city,
                            postalCode);
                        close();
                    }}>
                    <DialogTitle>
                        Dodaj firmę
                    </DialogTitle>
                    <Stack spacing={2}>
                        <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                            <Stack spacing={2} sx={{overflow: "auto"}}>
                                <FormControl>
                                    <FormLabel>Nazwa</FormLabel>
                                    <Input autoFocus required
                                           value={name}
                                           onChange={(e) => {
                                               setName(e.target.value)
                                           }} placeholder={"Nazwa firmy"}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Telefon</FormLabel>
                                    <Input autoFocus required
                                           value={phone}
                                           onChange={(e) => {
                                               setPhone(e.target.value)
                                           }} placeholder={"Telefon"}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input autoFocus required
                                           value={email}
                                           type={"email"}
                                           onChange={(e) => {
                                               setEmail(e.target.value)
                                           }} placeholder={"Email"}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Strona internetowa</FormLabel>
                                    <Input autoFocus
                                           value={www}
                                           onChange={(e) => {
                                               setWww(e.target.value)
                                           }} placeholder={"Strona"}/>
                                </FormControl>
                            </Stack>
                            <Stack spacing={2}>
                                <FormControl>
                                    <FormLabel>Ulica</FormLabel>
                                    <Input autoFocus
                                           value={street}
                                           onChange={(e) => {
                                               setStreet(e.target.value)
                                           }} placeholder={"Ulica"}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Miasto</FormLabel>
                                    <Input autoFocus
                                           value={city}
                                           onChange={(e) => {
                                               setCity(e.target.value)
                                           }} placeholder={"Miasto"}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Kod pocztowy</FormLabel>
                                    <Input
                                        value={postalCode}
                                        onChange={(e) => {
                                            setPostalCode(e.target.value)
                                        }} placeholder={"Kod pocztowy"}/>
                                </FormControl>
                            </Stack>
                            <CompanyCategories categoriesList={categories} setCategories={setCategories}/>
                        </div>
                        <Stack spacing={2}>
                            <Button type="submit">Zapisz</Button>
                            <Button color={"neutral"} onClick={onClose}>Anuluj</Button>
                        </Stack>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default AddCampaignDialog;