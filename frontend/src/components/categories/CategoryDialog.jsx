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
                <DialogTitle>{localCategory ? "Edytuj branżę" : "Dodaj branżę"}</DialogTitle>
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
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default CategoryDialog;