import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCampaignsList = (currentPage = 0) => {
    const [campaigns, setCampaigns] = useState([])
    const [pageNumber, setPageNumber] = useState(null)
    const [loaded, setLoaded] = useState(false);
    const {loading} = useData(`/campaigns`, (data) => {
            setCampaigns(data.content)
            setPageNumber(data.totalPages)
            setLoaded(true);
        },
        [currentPage], [{name: "pageNumber", value: currentPage}])

    const {loading: loadingPost, post} = usePost(`/campaigns`,
        (data) => setCampaigns(current => {
            return [...current, data]
        }))

    const {loading: loadingPut, put} = usePut(`/campaigns`, (data) =>
        setCampaigns(current => {
            return [...current.filter(campaign => campaign.id !== data.id), data]
        }))

    const addCampaign = (name, startDate, userGroupId, description) => {
        post({
            name,
            startDate,
            description,
            userGroupId
        })
    }

    const modifyCampaign = (id, name, startDate, description) => {
        put({
            name,
            startDate,
            description
        }, `/campaigns/${id}`)
    }

    return {
        campaigns,
        addLoading: loadingPost,
        updateLoading: loadingPut,
        addCampaign,
        modifyCampaign,
        pageNumber,
        loading,
        loaded
    }
}

export const useCampaign = (id) => {
    const [campaign, setCampaign] = useState(null)
    const {loading} = useData(`/campaigns/${id}`, (data) => {
            setCampaign(data)
        },
        [id], [], [id, id === "none" ? null : true])

    return {campaign, loading}
}
