import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useCompany} from "../../data/CompaniesData";
import TabHeader from "../main/TabHeader";
import CompanyContactData from "./CompanyContactData";
import {LinearProgress, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";
import CompanyAddress from "./CompanyAddress";
import CompanyCategories from "./CompanyCategories";
import CompanyJourneys from "./CompanyJourneys";
import {decodeContactStatus} from "../../utils/DecodeContactStatus";
import CompanyContactPeople from "./CompanyContactPeople";
import AssignCompanyButton from "./AssignCompanyButton";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import Button from "@mui/joy/Button";
import {useConfirmationDialog} from "../../utils/ConfirmationDialog";
import {useMobileSize} from "../../utils/SizeQuery";


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
        addContactPerson, addingContactPerson, modifyContactPerson, deleteCompany
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
            document.title = company.name;
            return () => {
                document.title = "Szakal 2";
            }
        }
    }, [company]);

    const thisCampaignJourney = company ?
        company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;

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
                <Button style={{flex: mobile ? 0.4 : 1}} color={"danger"} onClick={() => {
                    openDialog(() => {
                        deleteCompany().then(() => {
                            navigate("/secure/companies");
                        })
                    })
                }}>Usuń firmę</Button>}
        </div>
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
                            akcji: {thisCampaignJourney ? decodeContactStatus(thisCampaignJourney.contactStatus) + `,
                             ${thisCampaignJourney.user ? thisCampaignJourney.user.name : "Brak przypisanego użytkownika"}
                             ${thisCampaignJourney.user ? thisCampaignJourney.user.surname : ""}` : "Wolna"}
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
                                       deleted={localCompany.deleted}
                                       updateCategories={updateCategories}
                                       updateCategoriesLoading={updatingCategories}
                    />
                    <CompanyContactPeople addContactPerson={addContactPerson}
                                          modifyContactPerson={modifyContactPerson}
                                          contactPeople={company.contactPeople || []}
                                          addingContactPerson={addingContactPerson}
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