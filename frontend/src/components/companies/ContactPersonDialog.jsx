import React, {useEffect, useState} from 'react';
import {Checkbox, DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack, Textarea} from "@mui/joy";
import Button from "@mui/joy/Button";
import {InputWithLimit, TextAreaWithLimit} from "../misc/InputWithLimit";
import PropTypes from "prop-types";
import {UseFieldValidation} from "../../utils/UseFieldValidation";
import {UseFormValidation} from "../../utils/UseFormValidation";

const ContactPersonDialog = ({
                                 open,
                                 close,
                                 addContactPerson,
                                 modifyContactPerson,
                                 contactPerson
                             }) => {

    const name = UseFieldValidation();
    const position = UseFieldValidation();
    const phone = UseFieldValidation();
    const email = UseFieldValidation();
    const comment = UseFieldValidation();
    const committee = UseFieldValidation();
    const [isAlumni, setIsAlumni] = useState(false);

    useEffect(() => {
        if (contactPerson) {
            name.setValue(contactPerson.name);
            position.setValue(contactPerson.position);
            phone.setValue(contactPerson.phone);
            email.setValue(contactPerson.email);
            comment.setValue(contactPerson.comment);
            setIsAlumni(contactPerson.alumni);
            committee.setValue(contactPerson.committee);
        }
    }, [contactPerson]);

    const clear = () => {
        name.reset();
        position.reset();
        phone.reset();
        email.reset();
        comment.reset();
        setIsAlumni(false);
        committee.reset();
    }

    const isFormValid = UseFormValidation([name, position, phone, email, comment, committee]);

    return (
        <Modal open={open}>
            <ModalDialog sx={{overflow: 'auto'}}>
                <DialogTitle>{contactPerson ? "Edytuj osobę kontaktową" : "Dodaj osobę kontaktową"}</DialogTitle>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    if (!isFormValid) return;
                    if (contactPerson) {
                        modifyContactPerson(
                            {
                                id: contactPerson.id,
                                name: name.value,
                                position: position.value,
                                alumni: isAlumni,
                                phone: phone.value,
                                email: email.value,
                                comment: comment.value,
                                committee: committee.value
                            })
                            .then(() => {
                                close();
                                clear();
                            })
                    } else {
                        addContactPerson(
                            name.value,
                            position.value,
                            isAlumni,
                            phone.value,
                            email.value,
                            comment.value,
                            committee.value
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
                            value={name.value}
                            limit={name.limit}
                            isValid={name.isValid}
                            onChange={name.handleChange}
                            placeholder={"Jan Kowalski"}
                            data-testid={"contact-person-name-input"}
                        />
                        <InputWithLimit
                            label={"Stanowisko"}
                            value={position.value}
                            limit={position.limit}
                            isValid={position.isValid}
                            onChange={position.handleChange}
                            placeholder={"CEO"}/>
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
                            value={phone.value}
                            limit={phone.limit}
                            isValid={phone.isValid}
                            onChange={phone.handleChange}
                            placeholder={"+4800000000"}/>
                        <InputWithLimit
                            label={"Email"}
                            value={email.value}
                            type={"email"}
                            limit={email.limit}
                            isValid={email.isValid}
                            onChange={email.handleChange}
                            placeholder={"jan.kowalski@gmail.com"}/>
                        <TextAreaWithLimit
                            label={"Komentarz"}
                            value={comment.value}
                            limit={comment.limit}
                            isValid={comment.isValid}
                            onChange={comment.handleChange}
                            placeholder={"Człowiek z HRów"}/>
                        <Textarea
                            label={"Komitet"}
                            value={committee.value}
                            onChange={(e) => {
                                committee.setValue(e.target.value)
                            }} placeholder={"AGH"}/>
                        <Button type="submit" disabled={!isFormValid}>Zapisz</Button>
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