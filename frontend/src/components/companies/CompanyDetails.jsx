import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useCompany} from "../../data/CompaniesData";
import TabHeader from "../main/TabHeader";
import CompanyContactData from "./CompanyContactData";
import {ButtonGroup, IconButton, LinearProgress, Typography} from "@mui/joy";
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


const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {userId} = useSelector(state => state.auth);
    const {hasRight} = useAccessRightsHelper();

    const {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress,
        updatingAddress, updateCategories, updatingCategories,
        addContactPerson, addingContactPerson
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
                onClick={() => {
                    addJourney(currentCampaign, company.id, userId)
                        .then((data) => {
                            navigate(`/secure/journeys/${data.id}`)
                        })
                }}>
                Przypisz
            </Button>
        } else {
            return <ButtonGroup color={"primary"} variant={"solid"}>
                <Button
                    onClick={() => {
                        addJourney(currentCampaign, company.id, userId)
                            .then((data) => {
                                navigate(`/secure/journeys/${data.id}`)
                            })
                    }}>
                    Przypisz
                </Button>
                <IconButton
                >
                    <ArrowDropDownIcon/>
                </IconButton>
            </ButtonGroup>
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
                                          contactPeople={company.contactPeople || []}
                                          addingContactPerson={addingContactPerson}/>

                </div>
            </>}
            {loading &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <LinearProgress/>
                </div>}
        </div>
    );
};

export default CompanyDetails;