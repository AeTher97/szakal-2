import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";

const AddCategoryDialog = ({open, addCategory, close}) => {

    const [name, setName] = useState("");

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj branżę</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        addCategory(name);
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa branży"}/>
                        </FormControl>
                        <Button type="submit">Dodaj</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default AddCategoryDialog;