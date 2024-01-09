import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCompanyListWithCampaign = (campaignId, currentPage = 0, search) => {
    const [companies, setCompanies] = useState([])
    const [pageNumber, setPageNumber] = useState([])

    const {loading} = useData("/companies",
        (data) => {
            setCompanies(data.content)
            setPageNumber(data.totalPages)
        }, [campaignId, search, currentPage],
        [{name: "campaign", value: campaignId},
            {name: "pageNumber", value: currentPage},
            {name: "name", value: search.name},
            {name: "category", value: search.category},
            {name: "status", value: search.status}], [campaignId])

    const {post} = usePost(`/companies`,
        (data) => setCompanies(current => {
            return [...current, data]
        }))

    const addCompany = (name, phone, email, www, categories, street, streetNumber, city, postalCode) => {
        post({
            name,
            phone,
            email,
            www,
            address: {
                street,
                streetNumber,
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
    const {loading: addingContactPerson, put: putContactPerson} = usePut(`/companies/${id}/contactPerson`,
        (data) => setCompany(data))

    const updateContactDetails = (name, email, phone, website) => {
        return put({
            name, email, phone, website
        })
    }

    const updateAddress = (city, street, streetNumber, postalCode) => {
        return putAddress({
            address: {
                city,
                street,
                streetNumber,
                postalCode
            }
        })
    }

    const updateCategories = (categories) => {
        return putCategories({
            categories: categories.map(category => category.id)
        })
    }

    const addContactPerson = (name, position, phone, email, comment) => {
        return putContactPerson({
            name, position, phone, email, comment
        })
    }

    return {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress, updatingAddress,
        updateCategories, updatingCategories, addContactPerson, addingContactPerson
    }

}