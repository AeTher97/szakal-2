import React, {useEffect, useState} from 'react';
import {Card, Divider, Typography} from "@mui/joy";
import {Star} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {contactStatusUtils} from "../utils/ContactStatusUtils";
import {formatLocalDate} from "../utils/DateUtils";
import {useNavigate} from "react-router-dom";
import {loadFavouriteJourneysAction} from "../redux/MiscActions";

const FavouriteJourneys = () => {

    const [loadedFavouriteJourneys, setLoadedFavouriteJourneys] = useState(false);
    const {favouriteJourneys} = useSelector(state => state.favouriteJourneys)
    const {isAuthenticated} = useSelector(state => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && !loadedFavouriteJourneys) {
            dispatch(loadFavouriteJourneysAction())
                .then(() => setLoadedFavouriteJourneys(true));
        }
    }, [isAuthenticated])

    return (
        <Card style={{overflowY: "auto", minHeight: 300, maxHeight: 400}}
              variant={"soft"}>
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 10}}>
                <Star color={"warning"}/>
                <Typography level={"h4"}>Ulubione kontakty</Typography>
            </div>
            <Divider/>
            <div>
                {favouriteJourneys.map((favouriteJourney, i) => {
                    const finished = favouriteJourney.contactJourney.finished;
                    return <div key={favouriteJourney.id}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            paddingBottom: 10,
                            paddingTop: i !== 0 ? 10 : 0
                        }} onClick={() => {
                            navigate(`/secure/journeys/${favouriteJourney.contactJourney.id}`)
                        }}>
                            <div>
                                <Typography
                                    color={"primary"}>{favouriteJourney.contactJourney.company.name}</Typography>
                                <Typography
                                    level={"body-sm"}>{favouriteJourney.contactJourney.campaign.name}</Typography>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                                <Typography style={{textAlign: "right"}} sx={theme => ({
                                    color: `${!finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                                })}
                                            level={"title-sm"}>{contactStatusUtils(favouriteJourney.contactJourney.contactStatus)}</Typography>
                                {finished && <Typography sx={theme => ({
                                    color: `${!finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                                })}
                                                         level={"title-sm"}>Zakończony</Typography>}
                                <Typography sx={theme => ({
                                    color: `${!finished ? theme.vars.palette.text.primary : theme.vars.palette.warning.solidDisabledColor}`
                                })}
                                            level={"title-sm"}>{formatLocalDate(favouriteJourney.contactJourney.journeyStart)}</Typography>
                            </div>
                        </div>
                        {i !== favouriteJourneys.length - 1 && <Divider inset={"context"}/>}
                    </div>
                })}
            </div>

        </Card>
    );
};

export default FavouriteJourneys;