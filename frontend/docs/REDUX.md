# Redux
The redux directory of the frontend stores data that has to be available in any place in the component tree. Information
can be obtained from the particular store using `const {userId} = useSelector(state => state.auth)` syntax where `userId`
is the information to be extracted and `auth` is the name of the store. Stores available in the application are:

* [auth](../src/redux/AuthStore.jsx) - Authentication reducer containing user access data and basic details
* [theme](../src/redux/ThemeStore.jsx) - Reducer that contains info about the theme if it's light or dark
* [campaigns](../src/redux/CampaignStore.jsx) - Reducer that contains information about the current active campaign
* [knownItems](../src/redux/KnownEntitiesStore.jsx) - Reducer that allows breadcrumbs to map random uuid -> a human-readable name
* [alert](../src/redux/AlertStore.jsx) - Reducer that is used to show toast alerts 
* [favouriteJourneys](../src/redux/FavouriteJourneyStore.jsx) - Reducer that hold info about the favourite journeys allowing 
it to be modified by the components far away from the favourite journey list in the component tree.

These names can be used in place of `auth` in the example. Exact values held by the stores can be checked by looking into
the files.

## Updating values in the stores
To update values contained in the store and action has to be dispatched using `import {useDispatch} from "react-redux"`.
Actions corresponding to the store are generally contained in the file with name pattern `${STORE}Actions` excluding 
a couple of actions contained in the [Misc Actions](../src/redux/MiscActions.jsx) file. All the components which state 
was updated because of an action will rerender.
