# Testing strategy

Ths philosophy used in the project is that **integration tests > unit tests**. Since this is basically a CRUD 
application what we are really concerned with. is making sure data passes correctly from the endpoint to the database 
and back, and that on any changes we pull it, modify it and save it back correctly. 

In my opinion integration tests are 
really useful for that since we can test that whole stack at once, using REST API that will be the most unlikely to 
change meaning that we can stick with the same test for a long time with minimal maintenance.
Any errors on any levels should also become visible really quickly since all layers have to work together correctly
giving us maximal value with least time spend on testing.

## Caveats
Integration tests are a little bit heavier to run, they require a docker environment set up (can be done simply by 
installing **Docker desktop**), but these drawback should be minor inconvenience compared to the benefits.

## Running integration tests
To run integration test all that has to be done is firing up `./gradlew integrationTest` command in the backend directory.
Alternatively they can be run from Intellij IDEA by clicking on **integrationTest** module and choosing 
**Run Tests in integr....**. Working docker environment is required.