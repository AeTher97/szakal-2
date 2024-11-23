export const SWITCH_CAMPAIGN = "SWITCH_CAMPAIGN"

export function campaignReducer(state = {currentCampaign: ""}, action) {
    if (action.type === SWITCH_CAMPAIGN) {
        return {
            currentCampaign: action.payload.currentCampaign
        }
    } else {
        return state;
    }

}
