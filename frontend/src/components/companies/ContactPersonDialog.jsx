import React, {useEffect, useState} from 'react';
import {Checkbox, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack, Textarea} from "@mui/joy";
import Button from "@mui/joy/Button";
import {TextareaAutosize} from "@mui/material";

const ContactPersonDialog = ({open, close, addContactPerson, modifyContactPerson,
                                    contactPerson
                                }) => {

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [isAlumni, setIsAlumni] = useState(false);
    const [committee, setCommittee] = useState("");

    useEffect(() => {
        if (contactPerson) {
            setName(contactPerson.name);
            setPosition(contactPerson.position);
            setPhone(contactPerson.phone);
            setEmail(contactPerson.email);
            setComment(contactPerson.comment);
            setIsAlumni(contactPerson.alumni)
            setCommittee(contactPerson.committee)
        }
    }, [contactPerson]);

    const clear = () => {
        setName("")
        setPosition("")
        setPhone("")
        setEmail("")
        setComment("")
        setIsAlumni(false)
        setCommittee("")
    }


    return (
        <Modal open={open}>
            <ModalDialog sx={{overflow: 'auto'}}>
                <DialogTitle>{contactPerson ? "Edytuj osobę kontaktową" : "Dodaj osobę kontaktową"}</DialogTitle>
                <form onSubmit={(event, value) => {
                    event.preventDefault();
                    if (contactPerson) {
                        modifyContactPerson(contactPerson.id,
                            name,
                            position,
                            isAlumni,
                            phone,
                            email,
                            comment,
                            committee)
                            .then(() => {
                                close();
                                clear();
                            })
                    } else {
                        addContactPerson(name,
                            position,
                            isAlumni,
                            phone,
                            email,
                            comment,
                            committee
                        ).then(() => {
                            close();
                            clear();
                        })
                    }
                }}>
                    <Stack spacing={2}>
                        <FormControl required>
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
                        <FormControl style={{display: "flex", flexDirection: "row", gap: 10}}>
                            <FormLabel>Alumn:</FormLabel>
                            <Checkbox
                                checked={isAlumni}
                                onChange={(e) => {
                                    setIsAlumni(e.target.checked)
                                }} />
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
                            <Textarea
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value)
                                }} placeholder={"Człowiek z HRów"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Komitet</FormLabel>
                            <Textarea
                                value={committee}
                                onChange={(e) => {
                                    setCommittee(e.target.value)
                                }} placeholder={"AGH"}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={() => {
                            clear();
                            close();
                        }}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
        ;
};

export default ContactPersonDialog;