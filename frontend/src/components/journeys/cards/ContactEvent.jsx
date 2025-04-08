import React, {useState} from 'react';
import {FormControl, Select, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import TimelineItem from "../../misc/timline/TimelineItem";
import UserAvatar from "../../misc/UserAvatar";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import PropTypes from "prop-types";
import {formatLocalDateTime} from "../../../utils/DateUtils";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";
import Option from "@mui/joy/Option";

const ContactEvent = ({event, journey, editContactEvent, contactStatusOptions}) => {
    const [editing, setEditing] = useState(false);
    const [editingDescription, setEditingDescription] = useState(event.description);
    const [editingContactStatus, setEditingContactStatus] = useState(event.eventType);
    const [editingContactPerson, setEditingContactPerson] = useState(event.contactPerson?.id || "CHOOSE");

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingContactStatus !== "CHOOSE" && editingDescription !== "") {
            editContactEvent(event.id, editingDescription, editingContactStatus, editingContactPerson === "CHOOSE" ? null : editingContactPerson, journey.user.id)
                .then(() => setEditing(false));
        }
    };

    return (
        <TimelineItem>
            {editing ? (
                <form onSubmit={handleEditSubmit}>
                    <FormControl>
                        <Select value={editingContactStatus}
                                onChange={(e, newValue) => setEditingContactStatus(newValue)}>
                            <Option value={"CHOOSE"} disabled>Wybierz typ</Option>
                            {contactStatusOptions.map(option => (
                                <Option key={option.name} value={option.name}>{option.text}</Option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Select value={editingContactPerson}
                                onChange={(e, newValue) => setEditingContactPerson(newValue)}>
                            <Option value={"CHOOSE"}>Osoba kontaktowa (może być puste)</Option>
                            {journey.company.contactPeople.map(person => (
                                <Option key={person.id} value={person.id}>{person.name}</Option>
                            ))}
                        </Select>
                    </FormControl>
                    <TextAreaWithLimit
                        limit={2000}
                        minRows={2}
                        value={editingDescription}
                        isValid={true}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        placeholder={"Opis"}
                        required
                    />
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 5, marginTop: 5}}>
                        <Button type={"submit"}>Zapisz</Button>
                        <Button onClick={() => setEditing(false)}>Anuluj</Button>
                    </div>
                </form>
            ) : (
                <>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div style={{display: "flex", gap: 5, flex: 2}}>
                            <UserAvatar name={event.user.name} id={event.user.id} surname={event.user.surname}
                                        image={event.user.profilePicture} text={false} size={"sm"}/>
                            <div>
                                <Typography level={"title-sm"}>{event.user.name} {event.user.surname}</Typography>
                                <Typography level={"body-xs"}>{formatLocalDateTime(event.date)}</Typography>
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <Typography level={"body-sm"} style={{textAlign: "right"}}>
                                {contactStatusUtils(event.eventType)}
                            </Typography>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography level={"body-md"}>{event.description}</Typography>
                        <Button onClick={() => setEditing(true)}>Edytuj</Button>
                    </div>
                    {event.contactPerson && (
                        <div>
                            <Typography level={"body-sm"}>
                                Osoba
                                kontaktowa: {event.contactPerson.name}{event.contactPerson.phone && `, ${event.contactPerson.phone}`}
                            </Typography>
                        </div>
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