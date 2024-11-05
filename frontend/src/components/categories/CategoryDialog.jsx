import React, {useEffect, useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";

const CategoryDialog = ({open, addCategory, close, localCategory}) => {

    const [name, setName] = useState("");

    useEffect(() => {
        if (localCategory) {
            setName(localCategory.name);
        }
    }, [localCategory]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>{localCategory ? "Edytuj kategorię" : "Dodaj kategorię"}</DialogTitle>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa branży"}/>
                        </FormControl>
                        <Button type="submit" onClick={(event, value) => {
                            event.preventDefault();
                            addCategory(name).then((r) => {
                                close();
                            });
                        }}>Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
            </ModalDialog>
        </Modal>
    );
};

export default CategoryDialog;