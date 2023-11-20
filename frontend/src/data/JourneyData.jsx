import {useData, usePost} from "./UseData";
import {useSelector} from "react-redux";
import {useState} from "react";

export const useCurrentCampaignJourneyList = () => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const [journeys, setJourneys] = useState([]);

    const {loading} = useData(`/campaigns/${currentCampaign}/journeys?pageNumber=0`,
        (data) => setJourneys(data.content), [currentCampaign], [currentCampaign])

    return {journeys, loading}
}

export const useAddContactJourney = () => {
    const post = usePost(`/journeys`)

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
        [id], [id])

    const post = usePost(`/journeys/${id}/events`, (data) => {
        setJourney(data);
    })

    const addContactEvent = (contactJourney, user, subject, description, eventType, contactPerson) => {
        post({
            contactJourney,
            user,
            subject,
            description,
            eventType,
            contactPerson
        })
    }

    return {journey, loading, addContactEvent}
}