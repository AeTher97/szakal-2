# Build system
To help with dependency management and building the code **Gradle** framework is employed in the project.
This article will cover some of the most important parts of working with gradle in this project.

## Gradlew script
Gradlew script is the entry point of all the operations that we can invoke in the gradle build system.
It works closely with the gradle wrapper that is explained in more detail below but is basically a script that 
configures the gradle in place on any system from a fresh state and executes the passed command. It has two version
**gradlew** for unix based systems and **gradlew.bat** for Windows. In practice, I would recommend using bash on Windows
as well and sticking to plain **gradlew** script. In the kind of multilayer project like we have here tu run tasks from
subprojects we use `:subproject` syntax.

For example to execute tests using gradlew run `./gradlew :backend:test` in the backend directory.

## Gradle wrapper
This project uses gradle wrapper to provide gradle support. What it means is that gradle doesn't have to be installed 
on a system for us to be able to run it. We ship very small jar called **gradle-wrapper.jar** 
that downloads the actual gradle executable with version specified by the project. So we can have a separate gradle 
installation for every project, similarly to venv in python. The version of gradle to use for this particular project is 
specified in **gradle/wrapper/gradle-wrapper.properties** file.

## Libs.versions.toml
The **/gradle/libs.versions.toml** file stories information about the dependency and plugin versions used in the 
project. If we want to add a new dependency or bump the version of an old one for any reason this is the place to do 
this. Versions defined here can be used across multiple gradle modules although this project only has one.

## Build.gradle
Build gradle is the hearth of a gradle project. It specified what plugins are used in the build. What dependencies 
project requires to work. What additional tasks are added to gradle (it's almost infinitely configurable, so we can make
it do almost anything). Configuration of already existing tasks. Sources of dependencies. Java Virtual Machine 
configuration and possibly so much more. Gradle has a pretty steep learning curve but the power it gives should not be 
underestimated.
