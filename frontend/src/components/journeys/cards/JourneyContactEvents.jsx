import React, {useState} from 'react';
import {FormControl, Select, Stack, Typography} from "@mui/joy";
import {JOURNEY_MODIFICATION_FOR_OTHERS} from "../../../utils/AccessRightsList";
import Option from "@mui/joy/Option";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import Button from "@mui/joy/Button";
import Timeline from "../../misc/timline/Timeline";
import TimelineItem from "../../misc/timline/TimelineItem";
import UserAvatar from "../../misc/UserAvatar";
import {formatLocalDateTime} from "../../../utils/DateUtils";
import {contactStatusUtils} from "../../../utils/ContactStatusUtils";
import {contactStatusOptions} from "../JourneyDetails";
import {useSelector} from "react-redux";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import PropTypes from "prop-types";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";

const JourneyContactEvents = ({addContactEvent, journey}) => {

    const {userId} = useSelector(state => state.auth)
    const [contactEventError, setContactEventError] = useState(false);
    const [contactStatus, setContactStatus] = useState("CHOOSE");
    const [contactPerson, setContactPerson] = useState("CHOOSE");
    const eventDescription = UseFieldValidation("", 2000);
    const {hasRight} = useAccessRightsHelper()


    const isUser = journey?.user && (userId === journey.user.id);
    const isFormValid = eventDescription.isValid;

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
                    if (!isFormValid) {
                        return;
                    }
                    if (contactPerson !== "CHOOSE") {
                        addContactEvent(journey.id, userId, eventDescription.value, contactStatus, contactPerson)
                    } else {
                        addContactEvent(journey.id, userId, eventDescription.value, contactStatus)
                    }
                    eventDescription.setValue("");
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
                                }} data-testid="event-type">
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
                                }} data-testid="event-contact-person">
                                    <Option value={"CHOOSE"}>Osoba kontaktowa (może być puste)</Option>
                                    {journey.company.contactPeople.map(person => {
                                        return <Option value={person.id}
                                                       key={person.id}>{person.name}</Option>
                                    })}

                                </Select>
                            </FormControl>
                            <TextAreaWithLimit limit={eventDescription.limit}
                                               minRows={2}
                                               value={eventDescription.value}
                                               isValid={eventDescription.isValid}
                                               onChange={eventDescription.handleChange}
                                               placeholder={"Opis"} required
                                               data-testid="event-description"/>
                            <Button type={"submit"} disabled={!isFormValid}
                                    data-testid="event-add-button">Dodaj</Button>
                        </Stack>
                    </div>
                </form>}
            <Timeline testId={"cypress-journey-events"}>
                {journey.contactEvents.sort((a, b) => {
                    return new Date(a.date) > new Date(b.date) ? -1 : 1;
                }).map(event => {
                    return <TimelineItem key={event.id}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <div style={{display: "flex", gap: 5, flex: 2}}>
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
                            <div style={{flex: 1}}>
                                <Typography level={"body-sm"} style={{textAlign: "right"}}>
                                    {contactStatusUtils(event.eventType)}
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

JourneyContactEvents.propTypes = {
    addContactEvent: PropTypes.func.isRequired,
    journey: PropTypes.object.isRequired
}

export default JourneyContactEvents;