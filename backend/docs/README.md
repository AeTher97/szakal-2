# Backend module
Backend for the **_Szakal-2_** application. Designed to pull, modify and push data
to the database. Build with gradle, written in Java with a little help of Spring framework. Version
contained in this repository only supports Postgres as the database but should be 
easily configurable for something else if need arises.

**Java 21 preview features are required** to run the backend because of usage of 
String templates.

## Structure of the documentation
This directory contains documentation that related strictly to backend. It explains:
* The structure of the code. 
* Build system used, in this case gradle.
* Way of modelling the data in the database
* Background on the testing strategy
* Small guide for the contributors
* A little bit of introduction on Spring (you should really check out the docs on the 
web if you want to work on this project, again **Baeldung is recommended**)

## Running and deploying
Most of the info needed for running this can be found in the root directory **README.md**. 
Couple of tips would be to again familiarize yourself with Spring (profiles, beans, services, context, configuration).
In production be mindful of keeping you jwt secret - ***secret***. Emails can be configured
by setting corresponding ENV properties but this is not required for the app to work.
