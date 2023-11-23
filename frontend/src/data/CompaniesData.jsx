import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCompanyListWithCampaign = (campaignId, currentPage = 0, search, category) => {
    const [companies, setCompanies] = useState([])
    const [pageNumber, setPageNumber] = useState([])

    const {loading} = useData("/companies",
        (data) => {
            setCompanies(data.content)
            setPageNumber(data.totalPages)
        }, [campaignId, search, currentPage, category],
        [{name: "campaign", value: campaignId},
            {name: "pageNumber", value: currentPage},
            {name: "name", value: search},
            {name: "category", value: category}])

    const {post} = usePost(`/companies`,
        (data) => setCompanies(current => {
            return [...current, data]
        }))

    const addCompany = (name, phone, email, www, categories, street, city, postalCode) => {
        post({
            name,
            phone,
            email,
            www,
            address: {
                street,
                city,
                postalCode
            },
            categories
        })
    }

    return {companies, loading, pageNumber, addCompany}
}

export const useCompany = (id) => {

    const [company, setCompany] = useState(null)
    const {loading} = useData(`/companies/${id}`, (data) => setCompany(data),
        [id]);

    const {loading: updatingContactDetails, put} = usePut(`/companies/${id}`, (data) => setCompany(data))
    const {loading: updatingAddress, put: putAddress} = usePut(`/companies/${id}`, (data) => setCompany(data))
    const {loading: updatingCategories, put: putCategories} = usePut(`/companies/${id}`, (data) => setCompany(data))

    const updateContactDetails = (name, email, phone, website) => {
        put({
            name, email, phone, website
        })
    }

    const updateAddress = (city, street, postalCode) => {
        putAddress({
            address: {
                city,
                street,
                postalCode
            }
        })
    }

    const updateCategories = (categories) => {
        putCategories({
            categories: categories.map(category => category.id)
        })
    }

    return {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress, updatingAddress,
        updateCategories, updatingCategories
    }

}