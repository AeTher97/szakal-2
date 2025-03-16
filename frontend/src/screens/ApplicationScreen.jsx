import React, {useState} from 'react';
import TopBar from "../components/navigation/TopBar";
import NavigationBar from "../components/navigation/NavigationBar";
import AppContent from "../layout/AppContent";
import SecureNavigationRoutes from "../components/navigation/SecureNavigationRoutes";
import SecureRoute from "../utils/SecureRoute";
import {useMediumSize} from "../utils/MediaQuery";
import ReleaseNotesDialog from "../utils/ReleaseNotesDialog";

const ApplicationScreen = () => {

    const mediumSize = useMediumSize();
    const [releaseNotesShown, setReleaseNotesShown] = useState(
        import.meta.env.VITE_SZAKAL_VERSION !== localStorage.getItem("releaseNotesVersion")
        && "disabled" !== localStorage.getItem("releaseNotesVersion"));

    return (
        <SecureRoute>
            <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
                <ReleaseNotesDialog open={releaseNotesShown}
                                    close={() => {
                                        setReleaseNotesShown(false)
                                        localStorage.setItem("releaseNotesVersion", import.meta.env.VITE_SZAKAL_VERSION);
                                    }}/>
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