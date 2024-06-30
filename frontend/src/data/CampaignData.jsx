import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCampaignsList = (userId, currentPage = 0) => {

    const [campaigns, setCampaigns] = useState([])
    const [pageNumber, setPageNumber] = useState(null)
    const {loading} = useData(`/campaigns`, (data) => {
            setCampaigns(data.content)
            setPageNumber(data.totalPages)
        },
        [pageNumber], [{name: "pageNumber", value: currentPage}])

    const {loading: loadingPost, post} = usePost(`/campaigns`, (data) => setCampaigns(current => {
        return [...current, data]
    }))

    const {loading: loadingPut, put} = usePut(`/campaigns`, (data) =>
        setCampaigns(current => {
        return [...current.filter(campaign => campaign.id !== data.id), data]
    }))

    const addCampaign = (name, startDate, description) => {
        console.log(description)
        post({
            name,
            startDate,
            description
        })
    }

    const modifyCampaign = (id, name, startDate, description) => {
        put({
            name,
            startDate,
            description
        }, `/campaigns/${id}`)
    }

    return {campaigns, addLoading: loadingPost, addCampaign, modifyCampaign, pageNumber}
}

export const useCampaign = (id) => {
    const [campaign, setCampaign] = useState(null)
    const {loading} = useData(`/campaigns/${id}`, (data) => {
            setCampaign(data)
        },
        [id],[],[id])

    return {campaign, loading}
}
