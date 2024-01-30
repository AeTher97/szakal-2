<img src="/frontend/public/szakal_logo.svg" width="300">
# Szakal-2
Project for managing IAESTE AGH committee company contacts
during various campaigns. The software is written in Java and React  and supports:
* Adding companies and their contact details
* Tracking contact journeys in respective campaigns
* Managing users and their access to data

## How to run
### Prerequisites 
To compile and run the application following software has to be installed on the machine:
* Git client
* Java 21 or higher JDK (Java and maven can be handled from Intellij, easier in my option)
* Maven
* Node.js
* Postgres database (directly on metal or in docker)
### Step-by-step guide
1. Clone this repository
2. Go into backend directory
3. Make sure postgres is running on your machine with created database and you know: **port, username and password**
4. Make sure JAVA_HOME is set correctly, you can run `java -version` to make sure, java 21 or higher is required
5. Run backend using this command `./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="--enable-preview -DDATABASE_URL={url=host:port/database_name} -DDATABASE_USERNAME={postgres_username} -DDATABASE_PASSWORD={postgres_password} -DJWT_SECRET={jwt_secret}"`
, where arguments are following:
   * **DATABASE_URL** - url to the database, has to contain host, port and database name without protocol 
   * **DATABASE_USERNAME** - username of the database user
   * **DATABASE_PASSWORD** - password of the database user
   * **JWT_SECRET** - secret string used to generate tokens, should be random unique for the application and kept secret
   * **EMAIL_USERNAME**(Optional) - email address to send emails from(password reset, notifications), is not necessary for development installations
   * **EMAIL_PASSWORD**(Optional) - email authorization code, has to be generated on google pages, email password for web won't work, is not necessary for development installations
   * **HEROKU_APP_DEFAULT_DOMAIN_NAME**(Optional) - name of the domain frontend is on so links in emails can point to right web addresses,  is not necessary for development installations
6. Spring boot application should start without errors
7. Open new terminal window
8. Go to frontend directory
9. Run `npm install`
10. Run npm start
11. Go to `localhost:3000`
12. Use the app
