import {useState} from "react";
import {useData, useDelete, usePost, usePut} from "./UseData";
import useWsTopic from "./WsHook";

export const useCompanyListWithCampaign = (campaignId, search, locks, currentPage = 0) => {

    const wsState = useWsTopic(`companies`);
    const [companies, setCompanies] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    if (campaignId === "none") {
        campaignId = null;
    }

    const {loading} = useData("/companies",
        (data) => {
            setCompanies(data.content)
            setPageNumber(data.page.totalPages)
            setTotalCount(data.page.totalElements)
        }, [campaignId, search, currentPage, wsState],
        [{name: "campaign", value: campaignId},
            {name: "pageNumber", value: currentPage},
            {name: "name", value: search.name},
            {name: "category", value: search.category},
            {name: "status", value: search.status},
            {name: "hasAlumni", value: search.hasAlumni},
            {name: "alumniDescription", value: search.alumniDescription},
            {name: "committee", value: search.committee},
            {name: "campaignName", value: search.campaignName},
            {name: "pageSize", value: search.pageSize},
            {name: "sort", value: search.sort}], locks)

    const {post} = usePost(`/companies`,
        (data) => setCompanies(current => {
            return [...current, data]
        }))

    const addCompany = (company) => {
        post(company)
    }

    return {companies, loading, pageNumber, totalCount, addCompany}
}

export const useCompany = (id) => {

    const wsState = useWsTopic(`company/${id}`);
    const [company, setCompany] = useState(null);
    const {loading} = useData(`/companies/${id}`, (data) => setCompany(data),
        [id, wsState]);

    const {loading: updatingContactDetails, put} = usePut(`/companies/${id}`, (data) => setCompany(data))
    const {loading: updatingAddress, put: putAddress} = usePut(`/companies/${id}`, (data) => setCompany(data))
    const {loading: updatingCategories, put: putCategories} = usePut(`/companies/${id}`, (data) => setCompany(data))
    const {
        loading: addingContactPerson,
        put: putContactPerson
    } = usePut(`/companies/${id}/contactPerson`, (data) => setCompany(data));
    const {
        loading: deletingContactPerson,
        deleteReq: deleteContactPersonReq
    } = useDelete(`/companies/${id}/contactPerson`, () => {
    });
    const {loading: deletingCompany, deleteReq} = useDelete(`/companies/${id}`, () => {
    });

    const updateContactDetails = (name, email, phone, website) => {
        return put({
            name, email, phone, www: website
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

    const addContactPerson = (name, position, alumni, phone, email, comment, committee) => {
        return putContactPerson({
            name, position, alumni, phone, email, comment, committee
        })
    }

    const modifyContactPerson = (contactPerson) => {
        return putContactPerson(contactPerson, `/companies/${id}/contactPerson/${contactPerson.id}`)
    }

    const deleteContactPerson = (contactPerson) => {
        return deleteContactPersonReq(contactPerson, `/companies/${id}/contactPerson/${contactPerson.id}`).then(() => {
            setCompany(current => ({
                ...current,
                contactPeople: current.contactPeople.filter(person => person.id !== contactPerson.id)
            }))
        })
    }

    const deleteCompany = () => {
        return deleteReq();
    }

    return {
        company, loading, updateContactDetails, updatingContactDetails, updateAddress, updatingAddress,
        updateCategories, updatingCategories, addContactPerson, addingContactPerson, modifyContactPerson,
        deleteCompany, deletingCompany, deleteContactPerson, deletingContactPerson,
    }

}