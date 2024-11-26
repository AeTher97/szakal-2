# Navigation
Navigation in the project is handled by the **react-router** library. It is divided into two levels:
* Insecure navigation - for anonymous users, allowing them to log in, sign up or reset password
* Secure navigation - for users that are logged in leading to component that show sensitive data.

Routes defined in the insecure navigation are located in [Main Navigation Routes](../src/components/navigation/MainNavigationRoutes.jsx),
routes for the secure navigation are located in [Secure Navigation Routes](../src/components/navigation/SecureNavigationRoutes.jsx).

Switching between secured locations is handled mainly by the [Navigation Bar](../src/components/navigation/NavigationBar.jsx),
or [Side Drawer](../src/components/navigation/SideDrawer.jsx) for the mobile sized screens.

Switching the currently active campaign is a task of [Top Bar](../src/components/navigation/TopBar.jsx) that is the same 
for both PCs and mobiles.