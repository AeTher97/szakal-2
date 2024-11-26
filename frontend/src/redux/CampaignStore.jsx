export const SWITCH_CAMPAIGN = "SWITCH_CAMPAIGN"

export function campaignStore(state = {currentCampaign: ""}, action) {
    if (action.type === SWITCH_CAMPAIGN) {
        return {
            currentCampaign: action.payload.currentCampaign
        }
    } else {
        return state;
    }

}
