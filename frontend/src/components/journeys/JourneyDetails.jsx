import React, {useEffect} from 'react';
import {addFavouriteJourney, addKnownItem, removeFavouriteJourney, removeKnownItem} from "../../redux/MiscActions";
import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useJourney} from "../../data/JourneyData";
import TabHeader from "../misc/TabHeader";
import {IconButton, Tooltip, Typography} from "@mui/joy";
import JourneyUser from "./cards/JourneyUser";
import JourneyCompany from "./cards/JourneyCompany";
import JourneyInfo from "./cards/JourneyInfo";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {useConfirmationDialog} from "../misc/ConfirmationDialog";
import {JOURNEY_MODIFICATION_FOR_OTHERS} from "../../utils/AccessRightsList";
import AssignCompanyButton from "../companies/AssignCompanyButton";
import JourneyContactEvents from "./cards/JourneyContactEvents";
import JourneyComments from "./cards/JourneyComments";
import {useMobileSize} from "../../utils/MediaQuery";
import {Star, StarOutline} from "@mui/icons-material";
import {isDevEnv, setDefaultTitle} from "../../App";


export const contactStatusOptions
    = [{name: "WAITING_FOR_RESPONSE", text: "Oczekiwanie na odpowiedź"},
    {name: "CALL_LATER", text: "Zadzwonić później"},
    {name: "NOT_INTERESTED", text: "Niezainteresowana"},
    {name: "UNABLE_TO_CONNECT", text: "Nie można się połączyć"},
    {name: "NOT_PICKING_UP", text: "Nieodebrany"},
    {name: "BARTER", text: "Barter"},
    {name: "SPONSOR", text: "Sponsor"},
    {name: "TRAINING", text: "Szkolenie"},
    {name: "DIFFERENT_FORM_PARTNERSHIP", text: "Inna forma współpracy"},
    {name: "CALL_NEXT_YEAR", text: "Zadzwonić w przyszłym roku"},
    {name: "INTERNSHIP", text: "Praktyka"},
    {name: "I_HAVE_TO_CONTACT_COMPANY", text: "Mam się skontaktować z firmą"},
    {name: "COMPANY_WILL_REACH_OUT", text: "Firma ma się skontaktować"}]

const JourneyDetails = () => {

        const location = useLocation();
        const dispatch = useDispatch();
        const {userId} = useSelector(state => state.auth)
        const {favouriteJourneys} = useSelector(state => state.favouriteJourneys)
        const {journey, addContactEvent, addComment, editComment, closeJourney, reopenJourney, removeUser}
            = useJourney(location.pathname.split("/")[3]);
        const {hasRight} = useAccessRightsHelper()
        const mobile = useMobileSize();

        const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz zakończyć kontakt?");
        const {openDialog: openRemoveUserFromJourneyDialog, render: renderRemoveUserFromJourneyDialog}
            = useConfirmationDialog("Czy na pewno chcesz usunąć osobnę z IAESTE z tego kontaktu?");
        const {openDialog: openReopenJourneyDialog, render: renderReopenJourneyDialog}
            = useConfirmationDialog("Czy na pewno chcesz otworzyć kontakt ponownie?");

        useEffect(() => {
            if (journey) {
                dispatch(addKnownItem(location.pathname.split("/")[3], `Kontakt z ${journey.company.name}`));
                document.title = `Kontakt z ${journey.company.name} (${journey.campaign.name}) ${isDevEnv() ? "(Development)" : ""}`;
                return () => {
                    dispatch(removeKnownItem(location.pathname.split("/")[4]))
                    setDefaultTitle();
                }
            }
        }, [location, journey]);


        const isUser = journey?.user && (userId === journey.user.id);
        const favouriteJourneyObject = favouriteJourneys.find(favouriteJourney => {
            if (!journey) {
                return false;
            }
            return favouriteJourney.contactJourney.id === journey.id;
        })


        const renderActions = () => {
            return <div
                style={{
                    display: "flex", gap: 5, flexWrap: "wrap", justifyContent: mobile ? "stretch" : "flex-end",
                    paddingBottom: mobile ? 5 : 0
                }}>
                <Tooltip title={"Dodaj do ulubionych"}>
                    <IconButton variant={"outlined"} onClick={() => {
                        if (favouriteJourneyObject) {
                            dispatch(removeFavouriteJourney(favouriteJourneyObject.id));
                        } else {
                            dispatch(addFavouriteJourney(journey.id));
                        }
                    }}>
                        {!favouriteJourneyObject && <StarOutline color={"warning"}/>}
                        {favouriteJourneyObject && <Star color={"warning"}/>}
                    </IconButton>
                </Tooltip>
                {journey.user && (hasRight(JOURNEY_MODIFICATION_FOR_OTHERS) || isUser) && journey.finished &&
                    <Button style={{flex: 1}} onClick={() => {
                        openReopenJourneyDialog(() => reopenJourney())
                    }}>Otwórz ponownie</Button>}
                {journey.user && (hasRight(JOURNEY_MODIFICATION_FOR_OTHERS) || isUser) && !journey.finished &&
                    <Button style={{flex: mobile ? 1 : 0}} onClick={() => {
                        openDialog(() => closeJourney())
                    }}>Zakończ</Button>}
                {journey.user && (hasRight(JOURNEY_MODIFICATION_FOR_OTHERS) || isUser) && !journey.finished &&
                    <Button variant={"outlined"} onClick={() => {
                        openRemoveUserFromJourneyDialog(() => removeUser())
                    }}>Odepnij osobę z IAESTE</Button>}
                {!journey.user && !journey.finished &&
                    <AssignCompanyButton company={journey.company} fromJourneyPage={true}/>}
            </div>
        }

        return (
            <>
                {journey && <div style={{paddingBottom: 10}}>
                    <TabHeader>
                        <Typography level={"h2"}>
                            Kontakt z {journey.company.name} {journey.finished ? "(Zakończony)" : ""}
                        </Typography>
                        {!mobile && renderActions()}
                    </TabHeader>
                    {mobile && renderActions()}
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
                    <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                        <JourneyContactEvents addContactEvent={addContactEvent} journey={journey}/>
                        <JourneyComments addComment={addComment} editComment={editComment} journey={journey}/>
                    </div>
                    {render()}
                    {renderRemoveUserFromJourneyDialog()}
                    {renderReopenJourneyDialog()}
                </div>}
            </>);
    }
;

export default JourneyDetails;