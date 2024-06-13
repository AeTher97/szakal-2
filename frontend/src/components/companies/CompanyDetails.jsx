import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useCompany} from "../../data/CompaniesData";
import TabHeader from "../main/TabHeader";
import CompanyContactData from "./CompanyContactData";
import {ButtonGroup, IconButton, LinearProgress, Menu, MenuItem, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";
import CompanyAddress from "./CompanyAddress";
import CompanyCategories from "./CompanyCategories";
import Button from "@mui/joy/Button";
import {useAddContactJourney} from "../../data/JourneyData";
import CompanyJourneys from "./CompanyJourneys";
import {JOURNEY_CREATION} from "../../utils/AccessRights";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import CompanyContactPeople from "./CompanyContactPeople";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AssignToSomeoneElseDialog from "./AssignToSomeoneElseDialog";
import {useConfirmationDialog} from "../../utils/ConfirmationDialog";


const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {userId} = useSelector(state => state.auth);
    const [open, setOpen] = React.useState(false);
    const [assignToSomeoneOpen, setAssignToSomeoneOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const {hasRight} = useAccessRightsHelper();
    const {openDialog, render} = useConfirmationDialog("Czy na pewno chcesz przypisać firmę do siebie?")

    const {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress,
        updatingAddress, updateCategories, updatingCategories,
        addContactPerson, addingContactPerson, modifyContactPerson
    } = useCompany(location.pathname.split("/")[3])

    const {addJourney} = useAddContactJourney();
    const navigate = useNavigate();

    useEffect(() => {
        if (company) {
            dispatch(addKnownItem(location.pathname.split("/")[3], company.name));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[3]))
            }
        }
    }, [location, company]);

    useEffect(() => {
        if (company) {
            setLocalCompany(company)
        }
    }, [company]);

    const thisCampaignJourney = company ?
        company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;

    const canModifyOthers = hasRight("journey_modification_for_others");

    const renderAssignButton = () => {
        if (thisCampaignJourney) {
            return;
        }
        if (hasRight(JOURNEY_CREATION) && currentCampaign && !canModifyOthers) {
            return <Button
                onClick={() => openDialog(() => {
                    addJourney(currentCampaign, company.id, userId)
                        .then((data) => {
                            navigate(`/secure/journeys/${data.id}`)
                        })
                })}>
                Przypisz
            </Button>
        } else {
            return <>
                <ButtonGroup color={"primary"} variant={"solid"} ref={anchorRef}>
                    <Button
                        onClick={() => openDialog(() => {
                            addJourney(currentCampaign, company.id, userId)
                                .then((data) => {
                                    navigate(`/secure/journeys/${data.id}`)
                                })
                        })}>
                        Przypisz
                    </Button>
                    <IconButton onMouseDown={() => setOpen(!open)}>
                        {open ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                    </IconButton>
                </ButtonGroup>
                <Menu open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current} >
                    <MenuItem
                        onClick={(event) => {
                            setOpen(false)
                            setAssignToSomeoneOpen(true)
                        }}>
                        Przypisz do kogoś innego
                    </MenuItem>
                </Menu>
            </>
        }
    }

    return (
        <div style={{overflow: "auto"}}>
            {company && localCompany && <>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{company.name}</Typography>
                        <Typography level={"title-sm"}>Dodana {formatLocalDateTime(company.insertDate)}</Typography>
                        <Typography level={"title-sm"}>Status w obecnej
                            akcji: {thisCampaignJourney ? decodeContactStatus(thisCampaignJourney.contactStatus) + `, ${thisCampaignJourney.user.name}
                             ${thisCampaignJourney.user.surname}` : "Wolna"}
                        </Typography>
                    </div>
                    <div>
                        {renderAssignButton(currentCampaign, company.id, userId, true)}
                    </div>
                </TabHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    padding: 5,
                    paddingBottom: 50,
                    overflow: "hidden"
                }}>
                    <CompanyContactData localCompany={localCompany}
                                        updateContactData={updateContactDetails}
                                        updateContactDataLoading={updatingContactDetails}
                    />
                    <CompanyAddress localCompany={localCompany}
                                    updateAddress={updateAddress}
                                    updateAddressLoading={updatingAddress}/>
                    <CompanyJourneys localCompany={localCompany}/>
                    <CompanyCategories categoriesList={localCompany.categories}
                                       setCategories={(getCategories) => {
                                           setLocalCompany(old => {
                                               return {
                                                   ...old,
                                                   categories: getCategories(localCompany.categories)
                                               }
                                           })
                                       }}
                                       updateCategories={updateCategories}
                                       updateCategoriesLoading={updatingCategories}
                    />
                    <CompanyContactPeople addContactPerson={addContactPerson}
                                          modifyContactPerson={modifyContactPerson}
                                          contactPeople={company.contactPeople || []}
                                          addingContactPerson={addingContactPerson}/>

                </div>
                {assignToSomeoneOpen && <AssignToSomeoneElseDialog open={assignToSomeoneOpen} close={() => setAssignToSomeoneOpen(false)}
                                            addJourney={addJourney} currentCampaign={currentCampaign}
                                            companyId={company.id}
                                            navigate={navigate}/>}
                {render()}
            </>}
            {loading &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <LinearProgress/>
                </div>}

        </div>
    );
};

export default CompanyDetails;