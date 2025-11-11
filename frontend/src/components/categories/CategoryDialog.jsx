import React, {useEffect} from 'react';
import {DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";
import {InputWithLimit} from "../misc/InputWithLimit";
import {UseFieldValidation} from "../../utils/UseFieldValidation";

const CategoryDialog = ({open, addCategory, close, localCategory}) => {

    const name = UseFieldValidation();

    const isFormValid = name.isValid;

    useEffect(() => {
        if (localCategory) {
            name.setValue(localCategory.name);
        }
    }, [localCategory]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>{localCategory ? "Edytuj kategorię" : "Dodaj kategorię"}</DialogTitle>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    addCategory(name.value).then(() => {
                        close();
                    })
                }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Nazwa</FormLabel>
                            <InputWithLimit autoFocus required
                                            value={name.value}
                                            limit={name.limit}
                                            isValid={name.isValid}
                                            onChange={name.handleChange}
                                            placeholder={"Nazwa kategorii   "}/>
                        </FormControl>
                        <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

CategoryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    addCategory: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    localCategory: PropTypes.object
}

export default CategoryDialog;