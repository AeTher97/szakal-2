import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";

const AddGroupDialog = ({open, addRole, close}) => {
    const [name, setName] = useState("");

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj grupę użytkowników</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        addRole(name);
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa roli"}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
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