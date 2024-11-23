# Testing strategy

Ths philosophy used in the project is that **integration tests > unit tests**. Since this is basically a CRUD 
application what we are really concerned with. is making sure data passes correctly from the endpoint to the database 
and back, and that on any changes we pull it, modify it and save it back correctly. 

In my opinion integration tests are 
really useful for that since we can test that whole stack at once, using REST API that will be the most unlikely to 
change meaning that we can stick with the same test for a long time with minimal maintenance.
Any errors on any levels should also become visible really quickly since all layers have to work together correctly
giving us maximal value with least time spend on testing.

Recently I also added Cypress end to end tests which will probably be the most effective in catching any issues with the
app. If any contributor would be to just write one test for the feature it should probably be a Cypress test cause this
gives the best confidence of the feature working.

## Caveats
Integration tests are a little bit heavier to run, they require a docker environment set up (can be done simply by 
installing **Docker desktop**), but these drawback should be minor inconvenience compared to the benefits.

## Running integration tests
To run integration test all that has to be done is firing up `./gradlew integrationTest` command in the backend directory.
Alternatively they can be run from Intellij IDEA by clicking on **integrationTest** module and choosing 
**Run Tests in integr....**. Working docker environment is required.

## Running Cypress tests

To run Cypress tests just execute ```npm install``` in frontend module and then npx Cypress run
```npx cypress run --browser chrome```, chrome needs to be installed and the app has to be running on port 8080 with
test
database loaded.