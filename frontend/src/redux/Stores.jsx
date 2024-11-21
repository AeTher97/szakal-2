import {combineReducers, configureStore} from "@reduxjs/toolkit"
import alertStore from "./AlertStore";
import {authReducer} from "./AuthStore";
import {themeReducer} from "./ThemeStore";
import {campaignReducer} from "./CampaignReducer";
import {favouriteJourneysReducer} from "./FavouriteJourneyStore";
import {knownEntityReducer} from "./KnownEntitiesStore";


export const stores = configureStore({
    reducer: combineReducers(
        {
            auth: authReducer,
            theme: themeReducer,
            campaigns: campaignReducer,
            knownItems: knownEntityReducer,
            alert: alertStore,
            favouriteJourneys: favouriteJourneysReducer
        })
});
