import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";

const AddCampaignDialog = ({open, addCampaign, close}) => {

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj akcję</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        addCampaign(name, startDate);
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa akcji"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Data rozpoczęcia</FormLabel>
                            <Input required
                                   type={"date"}
                                   value={startDate}
                                   onChange={(e) => {
                                       console.log(e.target.value)
                                       setStartDate(e.target.value)
                                   }}/>
                        </FormControl>
                        <Button type="submit">Dodaj</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default AddCampaignDialog;