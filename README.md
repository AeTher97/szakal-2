<p align="center">
<img src="/frontend/public/szakal_logo.svg" width="300">
</p>

# Szakal 2

![Deploy Status](https://github.com/AeTher97/szakal-2/actions/workflows/main.yml/badge.svg)
![Validation Status](https://github.com/AeTher97/szakal-2/actions/workflows/branch-validation.yml/badge.svg?branch=master)

Project for managing IAESTE AGH committee company contacts
during various campaigns. The software is written in Java and React  and supports:

* Adding companies and their contact details
* Tracking contact journeys in respective campaigns
* Managing users and their access to data

## How to run
### Prerequisites 

To compile and run the application for development following software has to be installed on the machine:
* Git client
* Java 21 or higher JDK (Java and gradle can be handled from Intellij, easier in my opinion), for command line script
  JAVA_HOME has to be set up correctly.
* Node.js with npm
* Postgres database (directly on metal or in docker), launch scripts handle

This is not required for the docker option as everything is set up in multi-stage build.

### Methods for launching Szakal 2 App

#### Docker method (the easiest, but worse for development since we don't get react development server)

Run the `setup-env-docker.sh` script, you might have to make it executable by running
`chmod +x {file}`. ~~Due to line endings on windows, testing
data will only be loaded on linux system (some magic can be done with `dos2unix` though)
For developing on Windows machines I recommend to use [wsl2](https://learn.microsoft.com/en-us/windows/wsl/install)
as an easy option to get a linux VM.~~  This was fixed and should
work on Windows now.

Docker option should generally be the easiest to get up.
This pulls a lot of data and can quite some time the first time is run. This option is not recommended
for development because there is no hot swap on react and deployment is longer.

#### Intellij IDEA method (best for development)

Basic setup for intellij is commited to the repository so just opening the szakal-2 folder as project should give a good
setup for development. Basic tasks for running are included so it should be as simple as provisioning postgres
on localhost:5432 with default credentials (and szakal database created) and running tasks:

* SzakalBackend
* start

from the top right menu.

#### Github codespace (for users familiar with the project and technologies)

Project is configured to run with codespaces directly on github.com. Launch is as easy as clicking appropriate buttons,

![Launching Codespace](./docs/codespaces-example.png)

There will be some learning curve there which might be worth adding additional docs, but for now I would just recommend
this for advanced users.

#### Command line method (the most manual and difficult)
Don't use this method for running in production, put properties in actual environmental variables, don't use development profile to avoid csrf and cors from being disabled.
1. Clone this repository
2. Go into backend directory
3. Make sure postgres is running on your machine with created database and you know: **port, username and password**
4. Make sure JAVA_HOME is set correctly, you can run `java -version` to make sure, java 21 or higher is required
5. Run backend using this command in the backend directory: `./gradlew bootRun --args='--spring.profiles.active=development' -PdatabaseUrl={url=host:port/database_name} -PdatabaseUsername={postgres_username} -PdatabasePassword={postgres_password} -PjwtSecret={jwt_secret}"`
, alternatively arguments can be set in `gradle.properties` file (more info [here](https://docs.gradle.org/current/userguide/build_environment.html#sec:project_properties)), or set in the system environmental variables, where arguments are following (gradle name, ENV variable name):
   * **databaseUrl, DATABASE_URL** - url to the database, has to contain host, port and database name without protocol 
   * **databaseUsername, DATABASE_USERNAME** - username of the database user
   * **databasePassword, DATABASE_PASSWORD** - password of the database user
   * **jwtSecret, JWT_SECRET** - secret string used to generate tokens, should be random unique for the application and kept secret
   * **emailUsername, EMAIL_USERNAME**(Optional) - email address to send emails from(password reset, notifications), is not necessary for development installations
   * **emailPassword, EMAIL_PASSWORD**(Optional) - email authorization code, has to be generated on google pages, email password for web won't work, is not necessary for development installations
   * **herokuAppDefaultDomainName, HEROKU_APP_DEFAULT_DOMAIN_NAME**(Optional) - name of the domain frontend is on so links in emails can point to right web addresses,  is not necessary for development installations
6. Spring boot application should start without errors (gradle task stops at 83%)
7. Open new terminal window
8. Go to frontend directory
9. Run `npm install`
10. Run `npm start`
11. Go to `localhost:3000`
12. Use the app

#### Alternative way of running development stack



### Hosting frontend from spring
It is possible to build production frontend version and host it directly from spring server.
To do that run `./build-and-copy.sh` script in the project root to create sources in spring public directory. After that, launch the server as above skipping all the steps after step 6.
Frontend will be hosted on the backend url: `localhost:8080`.

## More information and contributing
Both most important modules **backend and frontend** have way more information in their respective **/docs** directories. 

Contributors that would like to help with the development of Szakal should read through those documents.
