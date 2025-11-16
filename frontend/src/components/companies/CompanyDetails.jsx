import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/MiscActions";
import {useCompany} from "../../data/CompaniesData";
import TabHeader from "../misc/TabHeader";
import CompanyContactData from "./cards/CompanyContactData";
import {LinearProgress, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";
import CompanyAddress from "./cards/CompanyAddress";
import CompanyCategories from "./cards/CompanyCategories";
import CompanyJourneys from "./cards/CompanyJourneys";
import {contactStatusUtils} from "../../utils/ContactStatusUtils";
import CompanyContactPeople from "./cards/CompanyContactPeople";
import AssignCompanyButton from "./AssignCompanyButton";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRightsList";
import Button from "@mui/joy/Button";
import {useConfirmationDialog} from "../misc/ConfirmationDialog";
import {useMobileSize} from "../../utils/MediaQuery";
import {isDevEnv, setDefaultTitle} from "../../App";


const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const navigate = useNavigate();
    const {hasRight} = useAccessRightsHelper();
    const mobile = useMobileSize();
    const {
        openDialog,
        render
    } = useConfirmationDialog(`Czy na pewno chcesz usunąć firmę ${localCompany ? localCompany.name : ""}`)

    const {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress,
        updatingAddress, updateCategories, updatingCategories,
        addContactPerson, addingContactPerson, modifyContactPerson, deleteCompany, deleteContactPerson
    } = useCompany(location.pathname.split("/")[3])

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
            document.title = `${company.name} ${isDevEnv() ? "(Development)" : ""}`;
            return () => {
                setDefaultTitle()
            }
        }
    }, [company]);

    const thisCampaignJourney = company ?
        company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;

    const openDeleteCompanyDialog = () => {
        openDialog(() => {
            deleteCompany().then(() => {
                navigate("/secure/companies");
            })
        })
    }

    const renderActions = () => {
        return <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "flex-end",
            paddingBottom: mobile ? 5 : 0
        }}>
            {currentCampaign !== 'none' && !company.deleted && <AssignCompanyButton company={company}/>}
            {hasRight(COMPANY_MODIFICATION) && !company.deleted &&
                <Button style={{flex: mobile && !thisCampaignJourney ? 0.4 : 1}} color={"danger"}
                        onClick={openDeleteCompanyDialog}>Usuń firmę</Button>}
        </div>
    }

    const getUserNameAndSurname = () => {
        return `${thisCampaignJourney.user ? thisCampaignJourney.user.name : "Brak przypisanego użytkownika"}
                             ${thisCampaignJourney.user ? thisCampaignJourney.user.surname : ""}`
    }

    return (
        <div>
            {company && localCompany && <>
                <TabHeader>
                    <div>
                        <Typography level={"h2"} color={company.deleted ? "danger" : null}
                                    style={{textDecoration: ""}}>
                            {company.deleted ? <>
                                    <s>
                                        {company.name}
                                    </s>
                                    (Usunięta)
                                </> :
                                <>
                                    {company.name}
                                </>}
                        </Typography>
                        <Typography level={"title-sm"}>Dodana {formatLocalDateTime(company.insertDate)}</Typography>
                        <Typography level={"title-sm"}>Status w obecnej
                            akcji: {thisCampaignJourney ? contactStatusUtils(thisCampaignJourney.contactStatus) +
                                `, ${getUserNameAndSurname()}` : "Wolna"}
                        </Typography>
                    </div>
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
                    overflow: "hidden"
                }}>
                    <CompanyContactData localCompany={localCompany}
                                        updateContactData={updateContactDetails}
                                        updateContactDataLoading={updatingContactDetails}
                    />
                    <CompanyAddress localCompany={localCompany}
                                    updateAddress={updateAddress}
                                    updateAddressLoading={updatingAddress}/>
                    <CompanyCategories categoriesList={localCompany.categories}
                                       setCategories={(getCategories) => {
                                           setLocalCompany(old => {
                                               return {
                                                   ...old,
                                                   categories: getCategories(localCompany.categories)
                                               }
                                           })
                                       }}
                                       deleted={localCompany.deleted}
                                       updateCategories={updateCategories}
                                       updateCategoriesLoading={updatingCategories}
                    />
                    <CompanyJourneys localCompany={localCompany}/>
                    <CompanyContactPeople addContactPerson={addContactPerson}
                                          modifyContactPerson={modifyContactPerson}
                                          contactPeople={company.contactPeople || []}
                                          addingContactPerson={addingContactPerson}
                                          deleteContactPerson={deleteContactPerson}
                                          deleted={localCompany.deleted}/>

                </div>
            </>}
            {loading &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <LinearProgress/>
                </div>}
            {render()}

        </div>
    );
};

export default CompanyDetails;