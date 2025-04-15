import React from 'react';
import {Button, DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack} from "@mui/joy";
import PropTypes from "prop-types";
import {InputWithLimit} from "../../misc/InputWithLimit";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";

const AddGroupDialog = ({open, addRole, close}) => {
    const name = UseFieldValidation();

    const isFormValid = name.isValid;

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj grupę użytkowników</DialogTitle>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        addRole(name.value);
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
                                            placeholder={"Nazwa grupy"}/>
                        </FormControl>
                        <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

AddGroupDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    addRole: PropTypes.func.isRequired,
};

export default AddGroupDialog;