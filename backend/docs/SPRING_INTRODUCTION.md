# Spring introduction
Spring is a framework that in principle provides us with the well implemented dependency injection mechanism. On top of 
that we use some more features like setting up a web server, creating a thread model for processing user requests, building up 
filter chains for us that look at the requests and process them smartly in the ways we never could. Integrates well with
the databases allowing us to write as little code as possible.

All of those awesome features allow us to just define business logic of this app instead of spending too much time 
wring all the request handling ourselves.

Unfortunately all of that comes with a bit of a learning curve. The whole framework and what you can do with it is very 
complex, but this document should outline very briefly what we use to make this project tick and how it works under the 
hood.

## Dependency injection
Dependency injection is a mechanism of injecting already constructed object into a newly created one so that the new one 
can use them without creating them itself. 

Spring really takes in that approach, simplifying it to the minimum. With 
Spring all we really have to do to build a complex application with many moving parts is to define constructors 
with all the pieces we need. Let's take an example:

```java
    public UserService(EmailService emailService, UsersRepository usersRepository,
                       PasswordEncoder passwordEncoder,
                       RoleService roleService,
                       JwtConfiguration jwtConfiguration, PasswordTokenRepository passwordTokenRepository) {
     //...
}
```
Here we have a constructor of a class called **UserService**, this class needs many elements to work, UserRepository to 
manage user data in the database, PasswordEncoder to encode password hashes, RoleService to manage role data in the 
database, ect. Normally in Java we would have to call this constructor and pass all those required object, possibly 
having to create them first. In Spring all we have to do is define constructors of those other objects and Spring will 
now how to create them and pass them here to us by itself. 

**Question would be if we have to define constructors of these object as well when does it end?** The answer is in the lowest
level when the constructor no longer needs any parameters will be our lowest level from which all the subsequent levels 
will be built. 

This approach lets our app basically build itself. We can also be sure in case of services or repositories that everywhere 
we operate on the same instance of the class without having to pass the same object through multiple lines of initialization code.
This also improves testability of classes since we can easily inject stubs and mocks into our classes.

All the classes that were created by Spring and exists in the application context are called **Beans*.*

## Filter chains
Spring sets up a web server for us (tomcat by default). Any http request that enters the application is passed through 
a complex filter chain set up for us by Spring. These filters decide if request has the correct type, content, if it's 
intent is malicious, the searches for the right piece of code to handle the request possibly finding one of our controllers 
or returning an error response if no implementation was found.

The most important stuff we do with the filter chains in this project is authorization and authentication.
We create a couple of custom filters that intercept request on specific paths (when it comes to authentication) and all 
the paths (when it comes to authorization) and execute our custom logic - which is verifying username and password 
of the user or the access token that was provided in the request. To learn more I would advise to go to the **security** 
package code.
