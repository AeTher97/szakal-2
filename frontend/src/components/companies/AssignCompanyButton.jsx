import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {useConfirmationDialog} from "../../utils/ConfirmationDialog";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {JOURNEY_CREATION} from "../../utils/AccessRights";
import Button from "@mui/joy/Button";
import {ButtonGroup, IconButton, Menu, MenuItem} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {useAddContactJourney} from "../../data/JourneyData";
import AssignToSomeoneElseDialog from "./AssignToSomeoneElseDialog";
import {useNavigate} from "react-router-dom";

const AssignCompanyButton = ({company, fromJourneyPage}) => {

    const [open, setOpen] = React.useState(false);
    const {userId} = useSelector(state => state.auth);
    const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz przypisać firmę do siebie?")
    const anchorRef = React.useRef(null);
    const {hasRight} = useAccessRightsHelper();
    const {currentCampaign} = useSelector(state => state.campaigns)
    const {addJourney} = useAddContactJourney();
    const [assignToSomeoneOpen, setAssignToSomeoneOpen] = useState(false)
    const navigate = useNavigate();

    const canModifyOthers = hasRight("journey_modification_for_others");

    const thisCampaignJourney = fromJourneyPage ? true : (company ?
        company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null);


    if (thisCampaignJourney && thisCampaignJourney.user) {
        return;
    }
    return (<>
            {hasRight(JOURNEY_CREATION) && currentCampaign && !canModifyOthers && <Button
                onClick={() => openDialog(() => {
                    addJourney(currentCampaign, company.id, userId)
                        .then((data) => {
                            if (!fromJourneyPage) {
                                navigate(`/secure/journeys/${data.id}`)
                            } else {
                                navigate(0);
                            }
                        })
                })}>
                Przypisz
            </Button>}
            {
                hasRight(JOURNEY_CREATION) && currentCampaign && canModifyOthers && <>
                    <ButtonGroup color={"primary"} variant={"solid"} ref={anchorRef}>
                        <Button
                            onClick={() => openDialog(() => {
                                addJourney(currentCampaign, company.id, userId)
                                    .then((data) => {
                                        if (!fromJourneyPage) {
                                            navigate(`/secure/journeys/${data.id}`)
                                        } else {
                                            navigate(0);
                                        }
                                    })
                            })}>
                            Przypisz
                        </Button>
                        <IconButton onMouseDown={() => setOpen(!open)}>
                            {open ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                        </IconButton>
                    </ButtonGroup>
                    <Menu open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
                        <MenuItem
                            onClick={(event) => {
                                setOpen(false)
                                setAssignToSomeoneOpen(true)
                            }}>
                            Przypisz do kogoś innego
                        </MenuItem>
                    </Menu>
                    {assignToSomeoneOpen &&
                        <AssignToSomeoneElseDialog open={assignToSomeoneOpen} close={() => setAssignToSomeoneOpen(false)}
                                                   addJourney={addJourney} currentCampaign={currentCampaign}
                                                   companyId={company.id}
                                                   navigate={navigate}
                                                   fromJourneyPage={fromJourneyPage}/>}
                </>
            }
            {render()}
        </>
    )
};

export default AssignCompanyButton;