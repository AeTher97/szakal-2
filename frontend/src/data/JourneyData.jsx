import {useData, usePost} from "./UseData";
import {useSelector} from "react-redux";
import {useState} from "react";

export const useCurrentCampaignJourneyList = (page = 0) => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const [journeys, setJourneys] = useState([]);
    const [pagesNumber, setPagesNumber] = useState([]);

    const {loading} = useData(`/campaigns/${currentCampaign}/journeys`,
        (data) => {
            setJourneys(data.content)
            setPagesNumber(data.totalPages)
        }, [currentCampaign, page], [{
            name: "pageNumber", value: page
        }], [currentCampaign])

    return {journeys, loading, pagesNumber}
}

export const useUserJourneyList = (page = 0) => {

    const {userId} = useSelector(state => state.auth)
    const {currentCampaign} = useSelector(state => state.campaigns)
    const [journeys, setJourneys] = useState([]);
    const [pagesNumber, setPagesNumber] = useState([]);

    const {loading} = useData(`/journeys`,
        (data) => {
            setJourneys(data.content)
            setPagesNumber(data.totalPages)
        }, [currentCampaign, page, userId], [{
            name: "pageNumber", value: page,
        }, {name: "userId", value: userId},
            {name: "campaignId", value: currentCampaign}], [currentCampaign, userId])

    return {journeys, loading, pagesNumber}
}

export const useAddContactJourney = () => {
    const {post} = usePost(`/journeys`)

    const addJourney = (campaign, company, user) => {
        return post({
            campaign,
            company,
            user
        })
    }
    return {addJourney}
}

export const useJourney = (id) => {
    const [journey, setJourney] = useState(null);
    const {loading} = useData(`/journeys/${id}`, (data) => setJourney(data),
        [id])

    const {post} = usePost(`/journeys/${id}/events`, (data) => {
        setJourney(data);
    })

    const addContactEvent = (contactJourney, user, subject, description, contactStatus, contactPerson) => {
        post({
            contactJourney,
            user,
            subject,
            description,
            contactStatus,
            contactPerson
        })
    }

    return {journey, loading, addContactEvent}
}