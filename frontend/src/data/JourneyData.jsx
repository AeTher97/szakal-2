import {usePost} from "./UseData";

export const useAddContactJourney = () =>
{
    const post = usePost(`/journeys`)

    const addJourney = (campaign, company, user) => {
        post({
            campaign,
            company,
            user
        })
    }
    return {addJourney}
}