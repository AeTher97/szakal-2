export const ADD_ITEM = "ADD_ITEM"
export const REMOVE_ITEM = "REMOVE_ITEM"

export function knownEntityReducer(state = {items: []}, action) {
    switch (action.type) {
        case ADD_ITEM:
            return {
                items: [...state.items, action.payload.item]
            }
        case REMOVE_ITEM: {
            const newItems = state.items.filter(item => item.id !== action.payload.item.id)
            return {
                items: newItems
            }
        }
        default:
            return state;

    }
}