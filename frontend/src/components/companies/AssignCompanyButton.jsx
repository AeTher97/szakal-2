import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {useConfirmationDialog} from "../misc/ConfirmationDialog";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {JOURNEY_CREATION} from "../../utils/AccessRightsList";
import Button from "@mui/joy/Button";
import {ButtonGroup, IconButton, Menu, MenuItem} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {useAddContactJourney} from "../../data/JourneyData";
import AssignToSomeoneElseDialog from "./AssignToSomeoneElseDialog";
import {useNavigate} from "react-router";
import PropTypes from "prop-types";

const AssignCompanyButton = ({company, fromJourneyPage = false}) => {

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

    const findThisCompanyJourney = () => {
        return company ? company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;
    }

    const thisCampaignJourney = fromJourneyPage ? true : findThisCompanyJourney();


    if (thisCampaignJourney?.user) {
        return;
    }

    return (<div style={{flex: 1, display: "flex"}}>
            {hasRight(JOURNEY_CREATION) && currentCampaign && !canModifyOthers && <Button style={{flex: 1}}
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
            {hasRight(JOURNEY_CREATION) && currentCampaign && canModifyOthers && <div style={{flex: 1}}>
                <ButtonGroup color={"primary"} variant={"solid"} ref={anchorRef} style={{flex: 1}}>
                    <Button style={{flex: 1}}
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
            </div>
            }
            {render()}
        </div>
    )
};

AssignCompanyButton.propTypes = {
    company: PropTypes.object.isRequired,
    fromJourneyPage: PropTypes.bool
}

export default AssignCompanyButton;