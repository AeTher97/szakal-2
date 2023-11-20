import {useState} from "react";
import {useData, usePost} from "./UseData";

export const useCompanyListWithCampaign = (campaignId) => {

    const [companies, setCompanies] = useState([])
    const {loading} = useData(`/companies?pageNumber=0${campaignId ? `&campaign=${campaignId}` : ""}`,
        (data) => setCompanies(data.content), [campaignId])

    const post = usePost(`/companies`, (data) => setCompanies(current => {
        return [...current, data]
    }))

    const addCompany = (name, phone, email, www, street, city, postalCode) => {
        post({
            name,
            phone,
            email,
            www,
            address: {
                street,
                city,
                postalCode
            }
        })
    }

    return {companies, loading, addCompany}
}

export const useCompany = (id) => {

    const [company, setCompany] = useState(null)
    const {loading} = useData(`/companies/${id}`, (data) => setCompany(data));

    return {company, loading}

}