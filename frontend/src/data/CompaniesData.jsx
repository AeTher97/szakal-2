import {useState} from "react";
import {useData} from "./UseData";

export const useCompanyListWithCampaign = (campaignId) => {

    const [companies, setCompanies] = useState([])
    const {loading} = useData(`/companies?pageNumber=0${campaignId ? `&campaign=${campaignId}` : ""}`,
        (data) => setCompanies(data.content), [campaignId])

    return {companies, loading}
}