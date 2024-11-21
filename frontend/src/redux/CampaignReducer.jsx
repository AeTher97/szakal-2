export const SWITCH_CAMPAIGN = "SWITCH_CAMPAIGN"

export function campaignReducer(state = {currentCampaign: ""}, action) {
    switch (action.type) {
        case SWITCH_CAMPAIGN:
            return {
                currentCampaign: action.payload.currentCampaign
            }
        default:
            return state;

    }
}
