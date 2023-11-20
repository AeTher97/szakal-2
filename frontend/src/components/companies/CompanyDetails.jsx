import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../redux/ReducerActions";
import {useCompany} from "../../data/CompaniesData";
import TabHeader from "../main/TabHeader";
import CompanyContactData from "./CompanyContactData";
import {Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";
import CompanyAddress from "./CompanyAddress";
import CompanyCategories from "./CompanyCategories";
import Button from "@mui/joy/Button";
import {useAddContactJourney} from "../../data/JourneyData";
import CompanyJourneys from "./CompanyJourneys";

const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {userId} = useSelector(state => state.auth);
    const {company, loading} = useCompany(location.pathname.split("/")[3])
    const {addJourney} = useAddContactJourney();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(addKnownItem(location.pathname.split("/")[3], "IAESTE"));
        return () => {
            dispatch(removeKnownItem(location.pathname.split("/")[3]))
        }
    }, [location]);

    useEffect(() => {
        if (company) {
            setLocalCompany(company)
        }
    }, [company]);

    const thisCampaignJourney = company ? company.contactJourneys.filter(journey => journey.campaign.id === currentCampaign)[0] : null;

    return (
        <div style={{overflow: "auto"}}>
            {company && localCompany && <>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{company.name}</Typography>
                        <Typography level={"title-sm"}>Dodana {formatLocalDateTime(company.insertDate)}</Typography>
                        <Typography level={"title-sm"}>Status w obecnej
                            akcji: {thisCampaignJourney ? thisCampaignJourney.contactStatus + ` ${thisCampaignJourney.user.name}
                             ${thisCampaignJourney.user.surname}` : "Wolna"}
                        </Typography>
                    </div>
                    <div>
                        {!thisCampaignJourney && <Button
                            onClick={() => {
                                addJourney(currentCampaign, company.id, userId)
                                    .then((data) => {
                                        navigate(`/secure/journeys/${data.id}`)
                                    })
                            }}>
                            Przypisz
                        </Button>}
                    </div>
                </TabHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: 10,
                    paddingBottom: 100,
                    overflow: "hidden"
                }}>
                    <CompanyContactData localCompany={localCompany}/>
                    <CompanyAddress localCompany={localCompany}/>
                    <CompanyJourneys localCompany={localCompany}/>
                    <CompanyCategories localCompany={localCompany} setLocalCompany={setLocalCompany}/>
                </div>
            </>}
        </div>
    );
};

export default CompanyDetails;