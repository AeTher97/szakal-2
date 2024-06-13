import React, {useEffect, useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack, Textarea} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useSelector} from "react-redux";

const CampaignDialog = ({open, addCampaign, close, editedCampaign, modifyCampaign}) => {

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [description, setDescription] = useState("");
    const {theme} = useSelector(state => state.theme);

    const clear = () => {
        setName("")
        setStartDate("")
        setDescription("")
    }

    useEffect(() => {
        if (editedCampaign) {
            setName(editedCampaign.name)
            setStartDate(editedCampaign.startDate)
            setDescription(editedCampaign.description)
        }
    }, [editedCampaign]);

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj akcję</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                        if (editedCampaign) {
                            modifyCampaign(editedCampaign.id, name, startDate, description)
                        } else {
                            addCampaign(name, startDate, description);
                        }
                        close();
                    }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Nazwa</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Nazwa akcji"}/>
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Data rozpoczęcia</FormLabel>
                            <Input required
                                   type={"date"}
                                   style={{colorScheme: theme}}
                                   value={startDate}
                                   onChange={(e) => {
                                       setStartDate(e.target.value)
                                   }}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Opis</FormLabel>
                            <Textarea
                                style={{colorScheme: theme}}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
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

export default CampaignDialog;