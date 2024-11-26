import {combineReducers, configureStore} from "@reduxjs/toolkit"
import alertStore from "./AlertStore";
import {authReducer} from "./AuthStore";
import {themeReducer} from "./ThemeStore";
import {campaignStore} from "./CampaignStore";
import {favouriteJourneysReducer} from "./FavouriteJourneyStore";
import {knownEntityReducer} from "./KnownEntitiesStore";

export const stores = configureStore({
    reducer: combineReducers(
        {
            auth: authReducer,
            theme: themeReducer,
            campaigns: campaignStore,
            knownItems: knownEntityReducer,
            alert: alertStore,
            favouriteJourneys: favouriteJourneysReducer
        })
});
