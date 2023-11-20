import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
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

const CompanyDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const [localCompany, setLocalCompany] = useState();
    const {currentCampaign} = useSelector(state => state.campaigns);
    // const {currentCampaign} = useSelector(state => state.campaigns);
    const {company, loading} = useCompany(location.pathname.split("/")[3])
    const {addJourney} = useAddContactJourney();

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

    return (
        <div style={{overflow: "auto"}}>
            {company && localCompany && <>
                <TabHeader>
                    <div>
                        <Typography level={"h2"}>{company.name}</Typography>
                        <Typography level={"title-sm"}>Dodana {formatLocalDateTime(company.insertDate)}</Typography>
                    </div>
                    <div>
                        <Button onClick={() => addJourney(currentCampaign, company.id,"f8f80ab3-785f-4903-833f-1dd0abc43e61")}>Przypisz</Button>
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
                    {/*<CompanyJourneys localCompany={localCompany}/>*/}
                    <CompanyCategories localCompany={localCompany} setLocalCompany={setLocalCompany}/>
                </div>
            </>}
        </div>
    );
};

export default CompanyDetails;