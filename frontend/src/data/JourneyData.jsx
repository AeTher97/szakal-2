import {useData, usePost, usePut} from "./UseData";
import {useSelector} from "react-redux";
import {useState} from "react";

export const useCurrentCampaignJourneyList = (page = 0, search, searchLoaded, pageSize = 10) => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const [journeys, setJourneys] = useState([]);
    const [pagesNumber, setPagesNumber] = useState(0);

    const {loading} = useData(`/campaigns/${currentCampaign}/journeys`,
        (data) => {
            setJourneys(data.content)
            setPagesNumber(data.totalPages)
        }, [currentCampaign, page, search],
        [{name: "pageNumber", value: page},
            {name: "pageSize", value: pageSize},
            {name: "companyName", value: search.companyName},
            {name: "status", value: search.status},
            {name: "detailedStatus", value: search.detailedStatus},
            {name: "user", value: search.user},
            {name: "eventText", value: search.eventText}],
        [currentCampaign, searchLoaded, currentCampaign === "none" ? null : true])

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


export const useTop10 = () => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const [top10, setTop10] = useState([]);

    const {} = useData(`/journeys/top10`,
        (data) => {
            setTop10(data.usersWithCount)
        }, [currentCampaign],
        [{name: "campaignId", value: currentCampaign}],
        [currentCampaign === "none" || currentCampaign.length === 0 ? null : true])

    return {top10}
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

    const {post: commentPost} = usePost(`/journeys/${id}/comments`, (data) => {
        setJourney(data);
    })

    const {put} = usePut(`/journeys/${id}/finish`, (data) => {
        setJourney(data);
    })

    const {put: putRemoveUser} = usePut(`/journeys/${id}/removeUser`, (data) => {
        setJourney(data);
    })


    const addContactEvent = (contactJourney, user, description, contactStatus, contactPerson) => {
        post({
            contactJourney,
            user,
            description,
            contactStatus,
            contactPerson
        })
    }

    const addComment = (user, comment) => {
        commentPost({
            user,
            comment
        })
    }

    const closeJourney = () => {
        put();
    }

    const removeUser = () => {
        putRemoveUser();
    }

    return {journey, loading, closeJourney, addContactEvent, addComment, removeUser}
}