import React, {useEffect, useState} from 'react';
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useJourney} from "../../data/JourneyData";
import TabHeader from "../main/TabHeader";
import {Avatar, FormControl, Select, Stack, Textarea, Typography} from "@mui/joy";
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

const JourneyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {userId} = useSelector(state => state.auth)
    const {journey, loading, addContactEvent, addComment} = useJourney(location.pathname.split("/")[3]);
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


    const isUser = journey && (userId === journey.user.id);

    return (
        <>
            {journey && <div style={{overflow: "auto", paddingBottom: 100}}>
                <TabHeader>
                    <Typography level={"h2"}>Kontakt z {journey.company.name}</Typography>
                </TabHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    padding: 5,
                    paddingBottom: 10,
                    overflow: "hidden"
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
                        {(isUser || hasRight("journey_modification_for_others")) && <form onSubmit={(e) => {
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
                                            <Option value={"WAITING_FOR_RESPONSE"}>Oczekiwanie na odpowiedź</Option>
                                            <Option value={"CALL_LATER"}>Zadzwonić później</Option>
                                            <Option value={"NOT_INTERESTED"}>Niezainteresowana</Option>
                                            <Option value={"BARTER"}>Barter</Option>
                                            <Option value={"SPONSOR"}>Sponsor</Option>
                                            <Option value={"TRAINING"}>Szkolenie</Option>
                                            <Option value={"DIFFERENT_FORM_PARTNERSHIP"}>Inna forma współpracy</Option>
                                            <Option value={"INTERNSHIP"}>Praktyka</Option>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <Select value={contactPerson} onChange={(e, newValue) => {
                                            setContactPerson(newValue)
                                        }}>
                                            <Option value={"CHOOSE"}>Osoba kontaktowa (może być puste)</Option>
                                            {journey.company.contactPeople.map(person => {
                                                return <Option value={person.id}>{person.name}</Option>
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
                                            <Avatar size={"sm"}>
                                                {event.user.name[0]}{event.user.surname[0]}
                                            </Avatar>
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
                                            kontaktowa: {event.contactPerson.name}{event.contactPerson.phone && `, ${event.contactPerson.phone}`}</Typography>
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
                            if(comment !== "") {
                                addComment(userId, comment);
                            }
                            setEventDescription("")
                            setContactStatus("CHOOSE")
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
                            return <div key={comment.id} tyle={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                {comment.comment}

                            </div>
                        })}
                        {journey.comments.length === 0 &&
                            <div style={{padding: 10, display: "flex", justifyContent: "center"}}>
                            <Typography>Brak komentarzy</Typography>
                            </div>}
                    </div>
                </div>
            </div>}
        </>
    );
};

export default JourneyDetails;