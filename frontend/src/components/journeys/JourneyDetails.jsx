import React, {useEffect, useState} from 'react';
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useJourney} from "../../data/JourneyData";
import TabHeader from "../main/TabHeader";
import {Avatar, FormControl, Input, Select, Stack, Textarea, Typography} from "@mui/joy";
import JourneyUser from "./JourneyUser";
import JourneyCompany from "./JourneyCompany";
import JourneyInfo from "./JourneyInfo";
import Timeline from "../timline/Timeline";
import TimelineItem from "../timline/TimelineItem";
import Button from "@mui/joy/Button";
import Option from '@mui/joy/Option';
import {formatLocalDateTime} from "../../utils/DateUtils";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";

const JourneyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const {userId} = useSelector(state => state.auth)
    const {journey, loading, addContactEvent} = useJourney(location.pathname.split("/")[3]);

    useEffect(() => {
        if (journey) {
            dispatch(addKnownItem(location.pathname.split("/")[3], `Kontakt z ${journey.company.name}`));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[4]))
            }
        }
    }, [location, journey]);

    const [contactStatus, setContactStatus] = useState("CHOOSE");
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");


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
                        <Timeline>
                            {journey.contactEvents.map(event => {
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
                                        <div>{decodeContactStatus(event.eventType)}</div>
                                    </div>
                                    <Typography level={"title-md"}>{event.subject}</Typography>
                                    <Typography level={"body-md"}>{event.description}</Typography>
                                </TimelineItem>
                            })}
                            {journey.contactEvents.length === 0 &&
                                <Typography>Brak wydarzeń</Typography>}
                        </Timeline>
                        {isUser && <form onSubmit={(e) => {
                            e.preventDefault();
                            if (contactStatus === "CHOOSE") {
                                return;
                            }
                            addContactEvent(journey.id, userId, eventTitle, eventDescription, contactStatus)
                        }}>
                            <div style={{display: "flex"}}>
                                <Stack spacing={1} style={{flex: 1}}>
                                    <Typography level={"title-lg"}>Nowe wydarzenie</Typography>
                                    <FormControl>
                                        <Select value={contactStatus} onChange={(e, newValue) => {
                                            setContactStatus(newValue)
                                        }}>
                                            <Option value={"CHOOSE"} disabled>Wybierz</Option>
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
                                        <Input type={"text"} value={eventTitle} onChange={(e) => {
                                            setEventTitle(e.target.value)
                                        }} fullWidth placeholder={"Tytuł"} required/>
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
                    </div>
                    <div style={{flex: 1}}>
                        <Typography level={"h3"}>Komentarze</Typography>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default JourneyDetails;