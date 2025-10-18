import React, {useState} from 'react';
import {Button, FormControl, Link, Option, Select, Stack, Typography} from "@mui/joy";
import TimelineItem from "../../misc/timline/TimelineItem";
import UserAvatar from "../../misc/UserAvatar";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import PropTypes from "prop-types";
import {formatLocalDateTime} from "../../../utils/DateUtils";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";

const ContactEvent = ({event, journey, editContactEvent, contactStatusOptions, userId}) => {
    const [editing, setEditing] = useState(false);
    const [editingDescription, setEditingDescription] = useState(event.description);
    const [editingContactStatus, setEditingContactStatus] = useState(event.eventType);
    const [editingContactPerson, setEditingContactPerson] = useState(event.contactPerson?.id || "CHOOSE");

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingContactStatus !== "CHOOSE" && editingDescription !== "") {
            editContactEvent(event.id, editingDescription, editingContactStatus, editingContactPerson === "CHOOSE" ? null : editingContactPerson, userId)
                .then(() => setEditing(false));
        }
    };

    console.log(event)

    return (
        <TimelineItem>
            {editing ? (
                <form onSubmit={handleEditSubmit}>
                    <Stack spacing={1} style={{flex: 1}}>
                        <FormControl>
                            <Select value={editingContactStatus}
                                    onChange={(e, newValue) => setEditingContactStatus(newValue)}
                                    data-testid="edit-event-type">
                                <Option value={"CHOOSE"} disabled>Wybierz typ</Option>
                                {contactStatusOptions.map(option => (
                                    <Option key={option.name} value={option.name}>{option.text}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <Select value={editingContactPerson}
                                    onChange={(e, newValue) => setEditingContactPerson(newValue)}
                                    data-testid="edit-event-contact-person">
                                <Option value={"CHOOSE"}>Osoba kontaktowa (może być puste)</Option>
                                {journey.company.contactPeople.map(person => (
                                    <Option key={person.id} value={person.id}>{person.name}</Option>
                                ))}
                            </Select>
                        </FormControl>
                        <TextAreaWithLimit
                            data-testid="edit-contact-event-description"
                            limit={2000}
                            minRows={2}
                            value={editingDescription}
                            isValid={true}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder={"Opis"}
                            required
                        />
                        <div style={{display: "flex", justifyContent: "flex-end", gap: 5, marginTop: 7}}>
                            <Button type={"submit"} data-testid="save-contact-event-link">Zapisz</Button>
                            <Button color={"neutral"} onClick={() => setEditing(false)}>
                                Anuluj
                            </Button>
                        </div>
                    </Stack>
                </form>
            ) : (
                <>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div style={{display: "flex", gap: 5, flex: 2}}>
                            <UserAvatar
                                id={event.user.id}
                                name={event.user.name}
                                surname={event.user.surname}
                                image={event.user.profilePicture}
                                text={false}
                                size={"sm"}/>
                            <div>
                                <Typography level={"title-sm"}>{event.user.name} {event.user.surname}</Typography>
                                <Typography
                                    level={"body-xs"}>{formatLocalDateTime(event.date)}{event.edited ? ", (Edytowany)" : ""}</Typography>

                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <Typography level={"title-sm"} style={{textAlign: "right"}}>
                                {contactStatusUtils(event.eventType)}
                            </Typography>
                        </div>
                    </div>
                    <Typography level={"body-md"}>
                        {event.description}
                    </Typography>
                    {event.contactPerson && (
                        <div>
                            <Typography level={"body-sm"}>
                                Osoba
                                kontaktowa: {event.contactPerson.name}{event.contactPerson.phone && `, ${event.contactPerson.phone}`}
                            </Typography>
                        </div>
                    )}
                    {event.user.id === userId && (
                        <Link
                            onClick={() => setEditing(true)}
                            data-testid="edit-contact-event-link"
                            style={{cursor: "pointer"}}>
                            Edytuj
                        </Link>
                    )}
                </>
            )}
        </TimelineItem>
    );
};

ContactEvent.propTypes = {
    event: PropTypes.object.isRequired,
    journey: PropTypes.object.isRequired,
    editContactEvent: PropTypes.func.isRequired,
    contactStatusOptions: PropTypes.array.isRequired
};

export default ContactEvent;