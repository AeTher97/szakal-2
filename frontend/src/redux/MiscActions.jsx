import {ADD_FAVOURITE_JOURNEY, LOAD_FAVOURITE_JOURNEYS, REMOVE_FAVOURITE_JOURNEY,} from "./FavouriteJourneyStore";
import axios from "axios";
import {showError} from "./AlertActions";
import {SWITCH_THEME} from "./ThemeStore";
import {SWITCH_CAMPAIGN} from "./CampaignReducer";
import {ADD_ITEM, REMOVE_ITEM} from "./KnownEntitiesStore";
import {REFRESH} from "./AuthStore";


export const changeThemeAction = () => dispatch => {
    dispatch({type: SWITCH_THEME});
}

export const changeCampaignAction = (campaignId) => dispatch => {
    dispatch({type: SWITCH_CAMPAIGN, payload: {currentCampaign: campaignId}});
}

export const addKnownItem = (itemId, itemName) => dispatch => {
    dispatch({type: ADD_ITEM, payload: {item: {id: itemId, name: itemName}}});
}

export const removeKnownItem = (itemId) => dispatch => {
    dispatch({type: REMOVE_ITEM, payload: {item: {id: itemId}}});
}

export const reloadAction = () => dispatch => {
    dispatch({type: REFRESH})
}

export const loadFavouriteJourneysAction = () => dispatch => {
    return axios.get("/favouriteJourneys").then((res) => {
        dispatch({type: LOAD_FAVOURITE_JOURNEYS, payload: {items: res.data}})
    }).catch(e => {
        dispatch(showError(e.message));
    })
}

export const addFavouriteJourney = (journeyId) => dispatch => {
    axios.post("/favouriteJourneys", {
        journeyId: journeyId
    }).then((res) => {
        dispatch({type: ADD_FAVOURITE_JOURNEY, payload: {item: res.data}});
    }).catch(e => {
        dispatch(showError(e.message));
    })
}

export const removeFavouriteJourney = (journeyId) => dispatch => {
    axios.delete(`/favouriteJourneys/${journeyId}`)
        .then((_) => {
            dispatch({type: REMOVE_FAVOURITE_JOURNEY, payload: {item: {id: journeyId}}})
        }).catch(e => {
        dispatch(showError(e.message));
    })
}