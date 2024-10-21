import React, {useEffect, useState} from 'react';
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useJourney} from "../../data/JourneyData";
import TabHeader from "../main/TabHeader";
import {Divider, FormControl, Select, Stack, Textarea, Typography} from "@mui/joy";
import JourneyUser from "./JourneyUser";
import JourneyCompany from "./JourneyCompany";
import JourneyInfo from "./JourneyInfo";
import Timeline from "../timline/Timeline";
import TimelineItem from "../timline/TimelineItem";
import Button from "@mui/joy/Button";
import Option from '@mui/joy/Option';
import {formatLocalDateTime} from "../../utils/DateUtils";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {useConfirmationDialog} from "../../utils/ConfirmationDialog";
import {JOURNEY_MODIFICATION_FOR_OTHERS} from "../../utils/AccessRights";
import UserAvatar from "../UserAvatar";
import AssignCompanyButton from "../companies/AssignCompanyButton";

export const contactStatusOptions
    = [{name: "WAITING_FOR_RESPONSE", text: "Oczekiwanie na odpowiedź"},
    {name: "CALL_LATER", text: "Zadzwonić później"},
    {name: "NOT_INTERESTED", text: "Niezainteresowana"},
    {name: "BARTER", text: "Barter"},
    {name: "SPONSOR", text: "Sponsor"},
    {name: "TRAINING", text: "Szkolenie"},
    {name: "DIFFERENT_FORM_PARTNERSHIP", text: "Inna forma współpracy"},
    {name: "CALL_NEXT_YEAR", text: "Zadzwonić w przyszłym roku"},
    {name: "INTERNSHIP", text: "Praktyka"}]

const JourneyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {userId} = useSelector(state => state.auth)
    const {journey, loading, addContactEvent, addComment, closeJourney, removeUser}
        = useJourney(location.pathname.split("/")[3]);
    const {hasRight} = useAccessRightsHelper()

    useEffect(() => {
        if (journey) {
            dispatch(addKnownItem(location.pathname.split("/")[3], `Kontakt z ${journey.company.name}`));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[4]))
            }
        }
    }, [location, journey]);

    const [contactStatus, setContactStatus] = useState("CHOOSE");
    const [contactPerson, setContactPerson] = useState("CHOOSE");
    const [eventDescription, setEventDescription] = useState("");
    const [comment, setComment] = useState("");
    const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz zakończyć kontakt?");
    const {openDialog: openRemoveUserFromJourneyDialog, render: renderRemoveUserFromJourneyDialog}
        = useConfirmationDialog("Czy na pewno chcesz usunąć osobnę z IAESTE z tego kontaktu?");


    const isUser = journey && journey.user && (userId === journey.user.id);

    return (
        <>
            {journey && <div style={{paddingBottom: 10}}>
                <TabHeader>
                    <Typography level={"h2"}>
                        Kontakt z {journey.company.name} {journey.finished ? "(Zakończony)" : ""}
                    </Typography>
                    <div style={{display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end"}}>
                        {journey.user && (hasRight(JOURNEY_MODIFICATION_FOR_OTHERS) || isUser) && !journey.finished &&
                            <Button onClick={() => {
                                openDialog(() => closeJourney())
                            }}>Zakończ</Button>}
                        {journey.user && (hasRight(JOURNEY_MODIFICATION_FOR_OTHERS) || isUser) && !journey.finished &&
                            <Button variant={"outlined"} onClick={() => {
                                openRemoveUserFromJourneyDialog(() => removeUser())
                            }}>Odepnij osobę z IAESTE</Button>}
                        {!journey.user && !journey.finished &&
                            <AssignCompanyButton company={journey.company} fromJourneyPage={true}/>}
                    </div>
                </TabHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    padding: "5px 0 5px 0",
                    paddingBottom: 10,
                    overflow: "hidden",
                    maxWidth: "100vw"
                }}>
                    <JourneyInfo journey={journey}/>
                    <JourneyCompany company={journey.company}/>
                    <JourneyUser user={journey.user}/>
                </div>
                <div style={{display: "flex"}}>
                </div>
                <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                    <div style={{flex: 1}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Typography level={"h3"}>Wydarzenia kontaktowe</Typography>
                        </div>
                        {!journey.finished && (isUser || hasRight(JOURNEY_MODIFICATION_FOR_OTHERS)) &&
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (contactStatus === "CHOOSE") {
                                    return;
                                }
                                if (contactPerson !== "CHOOSE") {
                                    addContactEvent(journey.id, userId, eventDescription, contactStatus, contactPerson)
                                } else {
                                    addContactEvent(journey.id, userId, eventDescription, contactStatus)
                                }
                                setEventDescription("")
                                setContactStatus("CHOOSE")
                            }}>
                                <div style={{display: "flex"}}>
                                    <Stack spacing={1} style={{flex: 1}}>
                                        <Typography level={"title-lg"}>Nowe wydarzenie</Typography>
                                        <FormControl>
                                            <Select value={contactStatus} onChange={(e, newValue) => {
                                                setContactStatus(newValue)
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
                                        <FormControl>
                                            <Textarea minRows={2} value={eventDescription} onChange={(e) => {
                                                setEventDescription(e.target.value)
                                            }} placeholder={"Opis"} required/>
                                        </FormControl>
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
                    <div style={{flex: 1}}>
                        <Typography level={"h3"}>Komentarze</Typography>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (comment !== "") {
                                addComment(userId, comment);
                            }
                            setComment("")
                        }}>
                            <div style={{display: "flex"}}>
                                <Stack spacing={1} style={{flex: 1}}>
                                    <Typography level={"title-lg"}>Dodaj komentarz</Typography>
                                    <FormControl>
                                        <Textarea minRows={2} value={comment} onChange={(e) => {
                                            setComment(e.target.value)
                                        }} placeholder={"Komentarz"} required/>
                                    </FormControl>
                                    <Button type={"submit"}>Dodaj</Button>
                                </Stack>
                            </div>
                        </form>
                        {journey.comments.sort((a, b) => {
                            return new Date(a.date) > new Date(b.date) ? -1 : 1;
                        }).map(comment => {
                            return <div key={comment.id} style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                margin: 5
                            }}>
                                <div style={{display: "flex", gap: 5, alignItems: "center"}}>
                                    <UserAvatar name={comment.user.name}
                                                surname={comment.user.surname}
                                                image={comment.user.profilePicture}
                                                overrideMobile={true}
                                                size={"sm"}/>

                                </div>
                                <Typography level={"body-md"}>{comment.comment}</Typography>
                                <Typography
                                    level={"body-xs"}>{formatLocalDateTime(comment.date)}</Typography>
                                <Divider/>

                            </div>
                        })}
                        {journey.comments.length === 0 &&
                            <div style={{padding: 10, display: "flex", justifyContent: "center"}}>
                                <Typography>Brak komentarzy</Typography>
                            </div>}
                    </div>
                </div>
                {render()}
                {renderRemoveUserFromJourneyDialog()}
            </div>}
        </>
    );
};

export default JourneyDetails;