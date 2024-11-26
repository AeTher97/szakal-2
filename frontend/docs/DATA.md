# Data
The data fetching in Szakal is fulfilled using the custom family of hooks located in the [data](../src/data) directory.
The base of all the specific hooks is the `useData` hook. The base hook allows for fetching, pushing, putting and deleting
from any endpoint. More specific hooks are built on that to allow components to just use syntax similar to `useUser(id)` 
to fetch it's data.

I highly recommend looking at the `useData` hook and one of the specific hooks like [CompanyData](../src/data/CompaniesData.jsx)
before adding anything new. Addition of new endpoints should be a rare occurrence with the current state of the application.