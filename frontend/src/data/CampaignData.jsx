import {useState} from "react";
import {useData, usePost} from "./UseData";

export const useCampaignsList = () => {

    const [campaigns, setCampaigns] = useState([])
    const {loading} = useData(`/campaigns?pageNumber=0`, (data) => setCampaigns(data.content))

    const {loading: loadingPost, post} = usePost(`/campaigns`, (data) => setCampaigns(current => {
        return [...current, data]
    }))
    const addCampaign = (name, startDate) => {
        post({
            name,
            startDate
        })
    }

    return {campaigns, addLoading: loadingPost, addCampaign}
}