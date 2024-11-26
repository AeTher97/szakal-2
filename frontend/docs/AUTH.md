# Auth

Szakal frontend authenticates to the backend using two authentication components:
* JWT access token
* FGP cookie

When making a requests to the backend both of those have to be present. The authentication scheme is loosely based on the 
[OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.md) 
spec for JWT authentication.

Access token is short-lived and requires frequent refreshing. For the refresh process **JWT_REFRESH** cookie is used. 

Additionally, the backend sets an **AUTHENTICATED** cookie when user logs in that has the same expiration as the 
**JWT_REFRESH** cookie. The goal for this cookie is to be available by the javascript on the frontend so that the frontend
is able to judge if refreshing is possible (secure cookies like JWT_REFRESH and FGP_COOKIE are not available to javascript),
If the **AUTHENTICATED** cookie is no longer present user gets logged out.

## Authentication components
### JWT access Token
Access token is an encoded json object composed of 3 parts divided by dot characters `.`. Example token looks something
like this: `eylfjdsfjlsd.fjldjojfidsojfdosjifodsjofdjsoj98u5439u43jfdsjl23j4.flsdjlfdsjlfdlsfds=`. The three distinct 
parts are:
* Header - meta information about the token e.g. the signing algorithm used to create the token
* Body - custom information contained in the token, in the case of Szakal it's userId, username, roles. In the future 
identifiable information will be removed from the token and fetched from backend endpoints leaving only userId and roles.
* Signature - last part of the token calculated using HS512 algorithm one should only be able to generate this signature
knowing the original secret string used to sign the token. Knowing that secret the token can be validated as correct and 
not tampered (if any of the encoded fields would be different the signature would have to change).

Token is passed to the backend inside of the request's authorization header in form `Bearer ${JWT_TOKEN}`.

### FGP cookie
FGP cookie(fingerprint cookie) is a cookie that contains a string that is tightly connected to the access token. It is 
in parallel with generating the access token and lasts as long as the token (100 seconds in default Szakal configuration).
The string is always unique. Access token contains a hashed value of the fingerprint in the body.

When user makes a request to the backend using a token and a corresponding FGP cookie. When user makes a request string 
from the fingerprint cookie is hashed and compared to the hash in the access token. If the hashes match and the access
token is valid the request is allowed through.

## Using Axios for authentication
To make authenticated request from the frontend it is enough to use axios instance from the default axios export 
`import axios from "axios";`. This instance is enhanced with middleware that handles refreshing of the token and adding 
the authentication header automatically. To make anonymous requests to the backend (to endpoints that don't require 
authentication) `import {defaultAxiosInstance} from "../data/AxiosWithoutAuth"` can be used;

## Auth reducer
Basic information about the users like the id, accessRights, accessToken are available in the redux auth reducer so that 
every component that requires access to auth data can use `const {userId} = useSelector(state => state.auth)` or similar 
from any place in the component tree. The exact variables available in the auth reducer can be seen in the code of the 
store [AuthStore.jsx](../src/redux/AuthStore.jsx).
