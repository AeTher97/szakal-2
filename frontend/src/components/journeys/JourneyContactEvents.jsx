import React, {useState} from 'react';
import {FormControl, Select, Stack, Typography} from "@mui/joy";
import {JOURNEY_MODIFICATION_FOR_OTHERS} from "../../utils/AccessRights";
import Option from "@mui/joy/Option";
import {TextAreaWithLimit} from "../../utils/InputWithLimit";
import Button from "@mui/joy/Button";
import Timeline from "../timline/Timeline";
import TimelineItem from "../timline/TimelineItem";
import UserAvatar from "../UserAvatar";
import {formatLocalDateTime} from "../../utils/DateUtils";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import {contactStatusOptions} from "./JourneyDetails";
import {useSelector} from "react-redux";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";

const JourneyContactEvents = ({addContactEvent, journey}) => {

    const {userId} = useSelector(state => state.auth)
    const [contactEventError, setContactEventError] = useState(false);
    const [contactStatus, setContactStatus] = useState("CHOOSE");
    const [contactPerson, setContactPerson] = useState("CHOOSE");
    const [eventDescription, setEventDescription] = useState("");
    const {hasRight} = useAccessRightsHelper()


    const isUser = journey && journey.user && (userId === journey.user.id);


    return (
        <div style={{flex: 1}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography level={"h3"}>Wydarzenia kontaktowe</Typography>
            </div>
            {!journey.finished && (isUser || hasRight(JOURNEY_MODIFICATION_FOR_OTHERS)) &&
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (contactStatus === "CHOOSE") {
                        setContactEventError(true);
                        return;
                    }
                    if (eventDescription.length > 2000) {
                        return;
                    }
                    if (contactPerson !== "CHOOSE") {
                        addContactEvent(journey.id, userId, eventDescription, contactStatus, contactPerson)
                    } else {
                        addContactEvent(journey.id, userId, eventDescription, contactStatus)
                    }
                    setEventDescription("")
                    setContactEventError(false);
                    setContactStatus("CHOOSE")
                }
                }>
                    <div style={{display: "flex"}}>
                        <Stack spacing={1} style={{flex: 1}}>
                            <Typography level={"title-lg"}>Nowe wydarzenie</Typography>
                            <FormControl error={contactEventError}>
                                <Select value={contactStatus} onChange={(e, newValue) => {
                                    setContactStatus(newValue);
                                    setContactEventError(false);
                                }}>
                                    <Option value={"CHOOSE"} disabled>Wybierz typ</Option>
                                    {contactStatusOptions.map(option => {
                                        return <Option key={option.name}
                                                       value={option.name}>{option.text}</Option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Select value={contactPerson} onChange={(e, newValue) => {
                                    setContactPerson(newValue)
                                }}>
                                    <Option value={"CHOOSE"}>Osoba kontaktowa (może być puste)</Option>
                                    {journey.company.contactPeople.map(person => {
                                        return <Option value={person.id}
                                                       key={person.id}>{person.name}</Option>
                                    })}

                                </Select>
                            </FormControl>
                            <TextAreaWithLimit limit={2000}
                                               minRows={2}
                                               value={eventDescription}
                                               onChange={(e) => {
                                                   setEventDescription(e.target.value)
                                               }} placeholder={"Opis"} required/>
                            <Button type={"submit"}>Dodaj</Button>
                        </Stack>
                    </div>
                </form>}
            <Timeline>
                {journey.contactEvents.sort((a, b) => {
                    return new Date(a.date) > new Date(b.date) ? -1 : 1;
                }).map(event => {
                    return <TimelineItem key={event.id}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{display: "flex", gap: 5}}>
                                <UserAvatar name={event.user.name}
                                            id={event.user.id}
                                            surname={event.user.surname}
                                            image={event.user.profilePicture}
                                            text={false}
                                            size={"sm"}/>
                                <div>
                                    <Typography
                                        level={"title-sm"}>{event.user.name} {event.user.surname}</Typography>
                                    <Typography
                                        level={"body-xs"}>{formatLocalDateTime(event.date)}</Typography>
                                </div>
                            </div>
                            <div>
                                <Typography level={"body-sm"}>
                                    {decodeContactStatus(event.eventType)}
                                </Typography>
                            </div>
                        </div>
                        <Typography level={"body-md"}>{event.description}</Typography>
                        {event.contactPerson &&
                            <div><Typography level={"body-sm"}>
                                Osoba
                                kontaktowa: {event.contactPerson.name}{event.contactPerson.phone
                                && `, ${event.contactPerson.phone}`}</Typography>
                            </div>}
                    </TimelineItem>
                })}
                {journey.contactEvents.length === 0 &&
                    <Typography>Brak wydarzeń</Typography>}
            </Timeline>
        </div>
    );
};

export default JourneyContactEvents;