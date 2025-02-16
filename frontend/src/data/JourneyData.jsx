import {useData, usePost, usePut} from "./UseData";
import {useSelector} from "react-redux";
import {useState} from "react";
import useWsTopic from "./WsHook";

export const useCurrentCampaignJourneyList = (search, searchLoaded, page = 0,) => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const wsState = useWsTopic(`journeys/${currentCampaign}`);
    const [journeys, setJourneys] = useState([]);
    const [pagesNumber, setPagesNumber] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const {loading} = useData(`/campaigns/${currentCampaign}/journeys`,
        (data) => {
            setJourneys(data.content);
            setPagesNumber(data.page.totalPages);
            setTotalCount(data.page.totalElements)
            setLoaded(true);
        }, [currentCampaign, page, search, wsState],
        [{name: "pageNumber", value: page},
            {name: "companyName", value: search.companyName},
            {name: "status", value: search.status},
            {name: "detailedStatus", value: search.detailedStatus},
            {name: "user", value: search.user},
            {name: "pageSize", value: search.pageSize},
            {name: "eventText", value: search.eventText},
            {name: "sort", value: search.sort}],
        [currentCampaign, searchLoaded, currentCampaign === "none" ? null : true])

    return {journeys, loading, loaded, pagesNumber, totalCount}
}

export const useUserJourneyList = (search, searchLoaded, page = 0) => {

    const {userId} = useSelector(state => state.auth)
    const {currentCampaign} = useSelector(state => state.campaigns)
    const [journeys, setJourneys] = useState([]);
    const [pagesNumber, setPagesNumber] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const {loading} = useData(`/journeys`,
        (data) => {
            setJourneys(data.content)
            setPagesNumber(data.page.totalPages)
            setTotalCount(data.page.totalElements)
        }, [currentCampaign, page, userId, search], [{
            name: "pageNumber", value: page,
        },
            {name: "userId", value: userId},
            {name: "campaignId", value: currentCampaign},
            {name: "companyName", value: search.companyName},
            {name: "status", value: search.status},
            {name: "pageSize", value: search.pageSize},
            {name: "detailedStatus", value: search.detailedStatus},
            {name: "eventText", value: search.eventText},
            {name: "sort", value: search.sort}],
        [currentCampaign, userId, searchLoaded])

    return {journeys, loading, pagesNumber, totalCount}
}


export const useTop10 = () => {

    const {currentCampaign} = useSelector(state => state.campaigns)
    const wsState = useWsTopic(`summary/${currentCampaign}`);
    const [top10, setTop10] = useState([]);

    useData(`/campaigns/top10`,
        (data) => {
            setTop10(data.usersWithCount)
        }, [currentCampaign, wsState],
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
    const wsState = useWsTopic(`journey/${journey?.id}`);

    const {loading} = useData(`/journeys/${id}`, (data) => setJourney(data),
        [id, wsState])

    const {post} = usePost(`/journeys/${id}/events`, (data) => {
        setJourney(data);
    })

    const { put: putEditContactEvent } = usePut(`/journeys/${id}/events`, (data) => {
        setJourney(data);
    });

    const {post: commentPost} = usePost(`/journeys/${id}/comments`, (data) => {
        setJourney(data);
    })

    const { put: putEditComment } = usePut(`/journeys/${id}/comments`, (data) => {
        setJourney(data);
    });

    const {put} = usePut(`/journeys/${id}/finish`, (data) => {
        setJourney(data);
    })

    const {put: putReopenJourney} = usePut(`/journeys/${id}/reopen`, (data) => {
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

    const editContactEvent = (eventId, newDescription, newContactStatus, contactPerson, userId) => {
        return putEditContactEvent({
            eventId,
            description: newDescription,
            contactStatus: newContactStatus,
            contactPerson,
            user: userId
        });
    };

    const addComment = (user, comment) => {
        commentPost({
            user,
            comment
        })
    }

    const editComment = (commentId, newCommentValue, userId) => {
        putEditComment({
            commentId,
            comment: newCommentValue,
            user: userId
        });
    }

    const closeJourney = () => {
        put();
    }

    const reopenJourney = () => {
        putReopenJourney();
    }

    const removeUser = () => {
        putRemoveUser();
    }

    return {journey, loading, closeJourney, reopenJourney, addContactEvent, editContactEvent, addComment, editComment, removeUser}
}