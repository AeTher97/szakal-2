import React, {useState} from 'react';
import {DialogTitle, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import CompanyCategories from "./cards/CompanyCategories";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {CATEGORY_MODIFICATION} from "../../utils/AccessRightsList";
import {InputWithLimit} from "../misc/InputWithLimit";
import PropTypes from "prop-types";
import { FormValidation } from '../../utils/FormValidation';
import {FieldValidation} from "../../utils/FieldValidation";

const AddCampaignDialog = ({open, close, addCompany}) => {
    const name = FieldValidation();
    const phone = FieldValidation();
    const email = FieldValidation();
    const www = FieldValidation();
    const street = FieldValidation();
    const streetNumber = FieldValidation();
    const city = FieldValidation();
    const postalCode = FieldValidation();
    const [categories, setCategories] = useState([]);

    const {hasRight} = useAccessRightsHelper()

    const onClose = () => {
        name.reset();
        phone.reset();
        email.reset();
        www.reset();
        street.reset();
        streetNumber.reset();
        city.reset();
        postalCode.reset();
        setCategories([]);
        close();
    }

    const isFormValid = FormValidation([ name, phone, email, www, street, streetNumber, city, postalCode ]);

    return (
        <Modal open={open}>
            <ModalDialog sx={{overflow: "auto"}}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!isFormValid) return;
                        addCompany({
                            name: name.value,
                            phone: phone.value,
                            email: email.value,
                            www: www.value,
                            address: {
                                street: street.value,
                                streetNumber: streetNumber.value,
                                city: city.value,
                                postalCode: postalCode.value
                            },
                            categories: categories.map(category => category.id)
                        })
                        onClose();
                    }}>
                    <DialogTitle>
                        Dodaj firmę
                    </DialogTitle>
                    <Stack spacing={2}>
                        <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                            <Stack spacing={2}>
                                <InputWithLimit
                                    required={true}
                                    label={"Nazwa"}
                                    autoFocus={true}
                                    value={name.value}
                                    limit={name.limit}
                                    isValid={name.isValid}
                                    onChange={name.handleChange}
                                    placeholder={"Nazwa firmy"}/>
                                <InputWithLimit
                                    label={"Telefon"}
                                    value={phone.value}
                                    limit={phone.limit}
                                    isValid={phone.isValid}
                                    onChange={phone.handleChange}
                                    placeholder={"Telefon"}/>
                                <InputWithLimit
                                    label={"Email"}
                                    value={email.value}
                                    type={"email"}
                                    limit={email.limit}
                                    isValid={email.isValid}
                                    onChange={email.handleChange}
                                    placeholder={"Email"}/>
                                <InputWithLimit
                                    label={"Strona internetowa"}
                                    value={www.value}
                                    limit={www.limit}
                                    isValid={www.isValid}
                                    onChange={www.handleChange}
                                    placeholder={"Strona"}/>
                            </Stack>
                            <Stack spacing={2}>
                                <InputWithLimit
                                    label={"Ulica"}
                                    value={street.value}
                                    limit={street.limit}
                                    isValid={street.isValid}
                                    onChange={street.handleChange}
                                    placeholder={"Ulica"}/>
                                <InputWithLimit
                                    label={"Miasto"}
                                    value={city.value}
                                    limit={city.limit}
                                    isValid={city.isValid}
                                    onChange={city.handleChange}
                                    placeholder={"Miasto"}/>
                                <InputWithLimit
                                    label={"Number ulicy"}
                                    value={streetNumber.value}
                                    limit={streetNumber.limit}
                                    isValid={streetNumber.isValid}
                                    onChange={streetNumber.handleChange}
                                    placeholder={"Number ulicy"}/>
                                <InputWithLimit
                                    label={"Kod pocztowy"}
                                    value={postalCode.value}
                                    limit={postalCode.limit}
                                    isValid={postalCode.isValid}
                                    onChange={postalCode.handleChange}
                                    placeholder={"Kod pocztowy"}/>
                            </Stack>
                            {hasRight(CATEGORY_MODIFICATION) && <CompanyCategories categoriesList={categories}
                                                                                   setCategories={setCategories}
                                                                                   allowAdding dialog/>}
                        </div>
                        <Stack spacing={2}>
                            <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
                            <Button color={"neutral"} onClick={onClose}>Anuluj</Button>
                        </Stack>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

AddCampaignDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    addCompany: PropTypes.func.isRequired,
};

export default AddCampaignDialog;