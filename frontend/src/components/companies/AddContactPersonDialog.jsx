import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";

const AddContactPersonDialog = ({open, close, addContactPerson, addingContactPerson}) => {

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");

    const clear = () => {
        setName("")
        setPosition("")
        setPhone("")
        setEmail("")
        setComment("")
    }


    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dodaj osobę kontaktową</DialogTitle>
                <form onSubmit={(event, value) => {
                    event.preventDefault();
                    addContactPerson(name,
                        position,
                        phone,
                        email,
                        comment
                    ).then(() => {
                        close();
                        clear();
                    })
                }}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Imię i Nazwisko</FormLabel>
                            <Input autoFocus required
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }} placeholder={"Jan Kowalski"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Stanowisko</FormLabel>
                            <Input
                                value={position}
                                onChange={(e) => {
                                    setPosition(e.target.value)
                                }} placeholder={"CEO"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Telefon</FormLabel>
                            <Input
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value)
                                }} placeholder={"+4800000000"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                value={email}
                                type={"email"}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }} placeholder={"jan.kowalski@gmail.com"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Komentarz</FormLabel>
                            <Input
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value)
                                }} placeholder={"Człowiek z HRów"}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
        ;
};

export default AddContactPersonDialog;