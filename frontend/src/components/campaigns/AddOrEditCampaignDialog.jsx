import React, {useEffect, useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useSelector} from "react-redux";
import UserGroupAutocomplete from "./UserGroupAutocomplete";
import PropTypes from "prop-types";
import {InputWithLimit, TextAreaWithLimit} from "../misc/InputWithLimit";
import {UseFieldValidation} from "../../utils/UseFieldValidation";
import {UseFormValidation} from "../../utils/UseFormValidation";

const AddOrEditCampaignDialog = ({
                                     open,
                                     addCampaign,
                                     close,
                                     editedCampaign,
                                     modifyCampaign,
                                     addToUserGroup = false
                                 }) => {

    const name = UseFieldValidation();
    const description = UseFieldValidation();
    const startDate = UseFieldValidation();
    const [userGroupId, setUserGroupId] = useState("");
    const {theme} = useSelector(state => state.theme);

    const isFormValid = UseFormValidation([name, startDate, description]);

    const clear = () => {
        name.reset();
        startDate.reset();
        description.reset();
        setUserGroupId("");
    }

    useEffect(() => {
        if (editedCampaign) {
            name.setValue(editedCampaign.name)
            startDate.setValue(editedCampaign.startDate)
            description.setValue(editedCampaign.description)
        }
    }, [editedCampaign]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj akcję</DialogTitle>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (editedCampaign) {
                            modifyCampaign(editedCampaign.id, name.value, startDate.value, description.value)
                        } else {
                            addCampaign(name.value, startDate.value, userGroupId, description.value);
                        }
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Nazwa</FormLabel>
                            <InputWithLimit autoFocus required
                                            value={name.value}
                                            limit={name.limit}
                                            isValid={name.isValid}
                                            onChange={name.handleChange}
                                            placeholder={"Nazwa akcji"}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Data rozpoczęcia</FormLabel>
                            <InputWithLimit required
                                            type={"date"}
                                            style={{colorScheme: theme}}
                                            value={startDate.value}
                                            limit={startDate.limit}
                                            isValid={startDate.isValid}
                                            onChange={startDate.handleChange}/>
                        </FormControl>
                        {addToUserGroup && <FormControl>
                            <FormLabel>Grupa użytkowników</FormLabel>
                            <UserGroupAutocomplete onChange={(userGroup) => {
                                setUserGroupId(userGroup.id);
                            }}/>
                        </FormControl>}
                        <FormControl>
                            <FormLabel>Opis</FormLabel>
                            <TextAreaWithLimit
                                style={{colorScheme: theme}}
                                value={description.value}
                                limit={description.limit}
                                isValid={description.isValid}
                                placeholder={"Opis"}
                                onChange={description.handleChange}/>
                        </FormControl>
                        <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
                        <Button color={"neutral"} onClick={() => {
                            clear();
                            close()
                        }}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

AddOrEditCampaignDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    addCampaign: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    editedCampaign: PropTypes.object,
    modifyCampaign: PropTypes.func.isRequired,
    addToUserGroup: PropTypes.bool
};

export default AddOrEditCampaignDialog;