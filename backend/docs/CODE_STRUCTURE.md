# Code Structure
The structure of the Java code is divided into a couple of more
or less important packages. To quickly summarize this and give 
overview of where to look for something let's go through them really quickly:

## Configuration 
Package used to configure features of the app. 

Two of those files - JwtConfiguration and DatabaseProperties are used to 
define params that will be read from the **application.properties** file. 
Spring does that for us automatically and this populates fields in those classes
with what we put in the properties file. This can then be injected pretty much 
anywhere to make use of the configuration.

The other files configure some features 
of spring programmatically. DatabaseConfig let's us read db config from env properties 
and MvcConfiguration let's us host static resources in a way that react understands 
what's going on when hosted from Spring server.

## Controllers
Controllers are a part of application that defines what rest endpoints 
we have available. Using Java annotations (@) we can easily define paths under which 
functionalities reside. It gives us a lot of freedom as to what request types, content 
types, response types etc. we can configure there. This layer generally doesn't have any logic
(except a bit of access restriction) and relays requests to the service layer which does actual
heavy lifting.

One Exception from this is **ExceptionHandlingController**, pun intended, which doesn't define any
endpoints but concerns itself with caching specified exception types when they get thrown from controllers
and translating them into something better looking in the response

## Exceptions
This package is very straight forward. It contains a couple of additional Exception types that 
we can use to signal issues with the app.

## Models
This package defines all the data structures used in the application. It is divided into two parts

* **entities** - relate to the model of the data stored in the database, it's what hibernate uses 
to generate tables for us so all the relations between tables that we need and columns that we require, their
types etc. are contained there.

* **dto** - data transfer objects. This is all the data models that we use to transfer over the network.
Defines how data should be structured when requests rae made to the app and what responses we give when
returning the data to the user. Most of the time those objects allow for omitting fields that we either 
don't want to transfer to the app (something that are generated on the backed e.g. comment dates) or data
we don't want to send back since it's e.g. a password or 
some heavy data that would make response slower, and it's not necessary on the front.

## Repositories 
Repositories are a group of classes that allow for defining methods that execute on the database.
They use hibernate ORM to generate SQL queries based on the method names. Only thing that we have to do 
is define a method on a repository interface with a correct name specifying what the method has to do 
and the ORM handles piecing it together and executing. This model also supports adding queries written by 
hand with the use of **@Query** annotation.

Two concrete classes in the package **CompanySpecification** and **JourneySpecification** are used to build 
a predicate with some requirement that we can then use in generated hibernate queries to filter records 
e.g. to find companies with a specific name. Writing these specifications is one of the hardest places of the 
app to modify and requires knowledge on how to do queries in SQL and how to force the ORM to do them in the same
way.

## Security
This package contains all the custom code used for authentication and authorization. The most important class here
is **SecurityConfiguration** that defines how customs access filters are injected into default authorization filter 
chain and what kind of general authorization level is required to access an endpoint - from anonymous access 
on endpoints like login to having to have a specific role for having to be authenticated and authorized to query 
and modify sensitive data. For more gradual access control (limiting certain endpoints to users having specific roles) 
is done on the controller level using **@PreAuthorize** annotation that allows us to specify more strict authorization
requirements - like having a company modification privilege.

## Services
Services are the actual business logic of the application. They get called by the controller to perform specific tasks
and operate directly on repositories or other services. Most of what the services do is pretty straight forward - they
pull the appropriate data from the database, add required changes, save the data back to the database. There are 
a couple of exceptions to services doing something more fun like - EmailService connects to the email provider and 
sends updates or password reset emails. Init service spins up on first app launch to populate system tables with 
starting admin account and available roles and scheduled contact service runs every minute to check if any scheduled 
contact information has to be send out.

## Utils
Utils are a very small package that contains classes that allows for loading email templates from static files, creating
calendar invites that get included in emails and finding null property names to make copying fields between classes 
a little bit easier.

## Validation
Validation package contains annotation that allow for verifying fields in object. The only currently implemented 
annotation is **@PasswordsMatch** and **@ValidPassword** that check if two passwords in fields **password** and 
**repeatPassword** match and if the field annotated with valid password has enough characters. More validation 
annotations should really be created like valid email, valid name etc. but this is something for the future.