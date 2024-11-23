import React, {useEffect, useState} from 'react';
import {Checkbox, DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack, Textarea} from "@mui/joy";
import Button from "@mui/joy/Button";
import {InputWithLimit, TextAreaWithLimit} from "../misc/InputWithLimit";
import PropTypes from "prop-types";

const ContactPersonDialog = ({
                                 open,
                                 close,
                                 addContactPerson,
                                 modifyContactPerson,
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
                        modifyContactPerson(
                            {
                                id: contactPerson.id,
                                name,
                                position,
                                alumni: isAlumni,
                                phone,
                                email,
                                comment,
                                committee
                            })
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
                        <InputWithLimit
                            label={"Imię i Nazwisko"}
                            required
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }} placeholder={"Jan Kowalski"}/>
                        <InputWithLimit
                            label={"Stanowisko"}
                            value={position}
                            onChange={(e) => {
                                setPosition(e.target.value)
                            }} placeholder={"CEO"}/>
                        <FormControl style={{display: "flex", flexDirection: "row", gap: 10}}>
                            <FormLabel>Alumn:</FormLabel>
                            <Checkbox
                                checked={isAlumni}
                                onChange={(e) => {
                                    setIsAlumni(e.target.checked)
                                }}/>
                        </FormControl>
                        <InputWithLimit
                            label={"Telefon"}
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value)
                            }} placeholder={"+4800000000"}/>
                        <InputWithLimit
                            label={"Email"}
                            value={email}
                            type={"email"}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }} placeholder={"jan.kowalski@gmail.com"}/>
                        <TextAreaWithLimit
                            label={"Komentarz"}
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value)
                            }} placeholder={"Człowiek z HRów"}/>
                        <Textarea
                            label={"Komitet"}
                            value={committee}
                            onChange={(e) => {
                                setCommittee(e.target.value)
                            }} placeholder={"AGH"}/>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={() => {
                            clear();
                            close();
                        }}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
};

ContactPersonDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    addContactPerson: PropTypes.func.isRequired,
    modifyContactPerson: PropTypes.func.isRequired,
    contactPerson: PropTypes.object
}

export default ContactPersonDialog;