## API docs
This folder contains a postman collection that can be used to 
test backend endpoints. The environment that allows to configure 
all the basic parameters from authentication and authorization
credentials to the ids used in API calls is also included.

To use it, import both json files to postman. All available requests 
will be visible in the collection divided into directories corresponding to features.
To populate values of variables used in request on can set them in the
environment in the top right corner. 

Access token can be automatically set
by running refresh request, a little bit of postman magic inserts the 
response correctly into the environment so all subsequent requests will be
authenticated as long as the token hasn't expired.

A lot of good docs can be found on postman in the Web so in case of questions
I suggest going there.