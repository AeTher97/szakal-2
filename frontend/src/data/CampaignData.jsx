import {useState} from "react";
import {useData, usePost} from "./UseData";

export const useCampaignsList = (userId, currentPage = 0) => {

    const [campaigns, setCampaigns] = useState([])
    const [pageNumber, setPageNumber] = useState([])
    const {loading} = useData(`/campaigns`, (data) => {
            setCampaigns(data.content)
            setPageNumber(data.totalPages)
        },
        [pageNumber], [{name: "pageNumber", value: currentPage}])

    const {loading: loadingPost, post} = usePost(`/campaigns`, (data) => setCampaigns(current => {
        return [...current, data]
    }))
    const addCampaign = (name, startDate) => {
        post({
            name,
            startDate
        })
    }

    return {campaigns, addLoading: loadingPost, addCampaign, pageNumber}
}
