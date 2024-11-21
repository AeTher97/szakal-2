import React from 'react';
import TopBar from "../components/navigation/TopBar";
import NavigationBar from "../components/navigation/NavigationBar";
import AppContent from "../layout/AppContent";
import SecureNavigationRoutes from "../components/navigation/SecureNavigationRoutes";
import SecureRoute from "../utils/SecureRoute";
import {useMediumSize} from "../utils/MediaQuery";

const ApplicationScreen = () => {

    const mediumSize = useMediumSize();

    return (
        <SecureRoute>
            <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
                <TopBar/>
                <AppContent>
                    {!mediumSize && <NavigationBar/>}
                    <SecureNavigationRoutes/>
                </AppContent>
            </div>

        </SecureRoute>
    );
};

export default ApplicationScreen;