import React from 'react';
import {DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";
import {InputWithLimit} from "../../misc/InputWithLimit";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";
import {UseFormValidation} from "../../../utils/UseFormValidation";

const AddRoleDialog = ({open, addRole, close}) => {
    const name = UseFieldValidation();
    const description = UseFieldValidation();

    const isFormValid = UseFormValidation([name, description]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj rolę</DialogTitle>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        addRole(name.value, description.value);
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
                                            placeholder={"Nazwa roli"}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Opis</FormLabel>
                            <InputWithLimit required
                                            value={description.value}
                                            limit={description.limit}
                                            isValid={description.isValid}
                                            onChange={description.handleChange}
                                            placeholder={"Opis"}/>
                        </FormControl>
                        <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

AddRoleDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    addRole: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
};

export default AddRoleDialog;