import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";

const AddRoleDialog = ({open, addRole, close}) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj rolę</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        addRole(name, description);
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa roli"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Opis</FormLabel>
                            <Input required
                                   value={description}
                                   placeholder={"Opis"}
                                   onChange={(e) => {
                                       setDescription(e.target.value)
                                   }}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default AddRoleDialog;