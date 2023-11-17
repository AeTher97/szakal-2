import {useEffect, useState} from "react";
import axios from "axios";

export const useGetCampaignsList = () => {

    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true;
        axios.get(`/campaigns?pageNumber=0`).then((res) => {
            if (mounted) {
                setCampaigns(res.data.content)
            }
        }).catch(e => {
            console.log(e.response.data.error);
        }).finally(() => {
            if (mounted) {
                setLoading(false);
            }
        })
        return () => {
            mounted = false;
        }
    }, []);


    return {campaigns, loading}
}