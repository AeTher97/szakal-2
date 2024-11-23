export const LOAD_FAVOURITE_JOURNEYS = "LOAD_JOURNEYS";
export const REMOVE_FAVOURITE_JOURNEY = "REMOVE_JOURNEY"
export const ADD_FAVOURITE_JOURNEY = "ADD_JOURNEY"

export function favouriteJourneysReducer(state = {favouriteJourneys: []}, action) {
    switch (action.type) {
        case LOAD_FAVOURITE_JOURNEYS:
            return {
                favouriteJourneys: action.payload.items
            }
        case REMOVE_FAVOURITE_JOURNEY: {
            const newItems = state.favouriteJourneys.filter(item => item.id !== action.payload.item.id)
            return {
                favouriteJourneys: newItems
            }
        }
        case ADD_FAVOURITE_JOURNEY:
            return {
                favouriteJourneys: [...state.favouriteJourneys, action.payload.item]
            }
        default:
            return state;

    }
}
