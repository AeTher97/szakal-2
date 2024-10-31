import React, {useState} from 'react';
import {DialogTitle, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import CompanyCategories from "./CompanyCategories";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {CATEGORY_MODIFICATION} from "../../utils/AccessRights";
import InputWithLimit from "../../utils/InputWithLimit";

const AddCampaignDialog = ({open, close, addCompany}) => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [www, setWww] = useState("");
    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [categories, setCategories] = useState([]);

    const {hasRight} = useAccessRightsHelper()

    const onClose = () => {
        setName("");
        setPhone("");
        setEmail("");
        setWww("");
        setStreet("");
        setCity("");
        setStreetNumber("");
        setPostalCode("");
        setCategories([]);
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
                            streetNumber,
                            city,
                            postalCode);
                        onClose();
                    }}>
                    <DialogTitle>
                        Dodaj firmę
                    </DialogTitle>
                    <Stack spacing={2}>
                        <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                            <Stack spacing={2}>
                                <InputWithLimit required={true} label={"Nazwa"}
                                                autoFocus={true}
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value)
                                                }} placeholder={"Nazwa firmy"}/>
                                <InputWithLimit
                                    label={"Telefon"}
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                    }} placeholder={"Telefon"}/>
                                <InputWithLimit
                                    label={"Email"}
                                    value={email}
                                    type={"email"}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }} placeholder={"Email"}/>
                                <InputWithLimit
                                    value={www}
                                    label={"Strona internetowa"}
                                    onChange={(e) => {
                                        setWww(e.target.value)
                                    }} placeholder={"Strona"}/>
                            </Stack>
                            <Stack spacing={2}>
                                <InputWithLimit
                                    label={"Ulica"}
                                    value={street}
                                    onChange={(e) => {
                                        setStreet(e.target.value)
                                    }} placeholder={"Ulica"}/>
                                <InputWithLimit
                                    label={"Miasto"}
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value)
                                    }} placeholder={"Miasto"}/>
                                <InputWithLimit
                                    label={"Number ulicy"}
                                    value={streetNumber}
                                    onChange={(e) => {
                                        setStreetNumber(e.target.value)
                                    }} placeholder={"Number ulicy"}/>
                                <InputWithLimit
                                    label={"Kod pocztowy"}
                                    value={postalCode}
                                    onChange={(e) => {
                                        setPostalCode(e.target.value)
                                    }} placeholder={"Kod pocztowy"}/>
                            </Stack>
                            {hasRight(CATEGORY_MODIFICATION) && <CompanyCategories categoriesList={categories}
                                                                                   setCategories={setCategories}
                                                                                   allowAdding dialog/>}
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