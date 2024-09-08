import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
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


const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);

    const {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress,
        updatingAddress, updateCategories, updatingCategories,
        addContactPerson, addingContactPerson, modifyContactPerson
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
        }
    }, [company]);

    const thisCampaignJourney = company ?
        company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;

    return (
        <div style={{overflow: "auto"}}>
            {company && localCompany && <>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{company.name}</Typography>
                        <Typography level={"title-sm"}>Dodana {formatLocalDateTime(company.insertDate)}</Typography>
                        <Typography level={"title-sm"}>Status w obecnej
                            akcji: {thisCampaignJourney ? decodeContactStatus(thisCampaignJourney.contactStatus) + `,
                             ${thisCampaignJourney.user ? thisCampaignJourney.user.name : "Brak przypisanego użytkownika"}
                             ${thisCampaignJourney.user ? thisCampaignJourney.user.surname : ""}` : "Wolna"}
                        </Typography>
                    </div>
                    <div>
                        {currentCampaign!=='none' && <AssignCompanyButton company={company}/>}
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
            </>}
            {loading &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <LinearProgress/>
                </div>}

        </div>
    );
};

export default CompanyDetails;