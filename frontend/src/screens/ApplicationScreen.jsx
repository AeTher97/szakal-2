import React, {useState} from 'react';
import TopBar from "../components/navigation/TopBar";
import NavigationBar from "../components/navigation/NavigationBar";
import AppContent from "../layout/AppContent";
import SecureNavigationRoutes from "../components/navigation/SecureNavigationRoutes";
import SecureRoute from "../utils/SecureRoute";
import {useMediumSize} from "../utils/MediaQuery";
import ReleaseNotesDialog from "../utils/ReleaseNotesDialog";

const ApplicationScreen = () => {

    const parseReleaseNotes = (semverString) => {
        if (!semverString || semverString === "disabled") {
            return null;
        }
        const splitParts = semverString.split(".");
        if (splitParts.length < 3) {
            return null;
        }
        return {
            major: splitParts[0],
            minor: splitParts[1],
            patch: splitParts[2]
        }
    }

    const shouldDisplayReleaseNotes = () => {
        if (localStorage.getItem("releaseNotesVersion") === "disabled") {
            return false;
        }
        const shownVersion = parseReleaseNotes(localStorage.getItem("releaseNotesVersion"));
        if (shownVersion) {
                const currentVersion = parseReleaseNotes(import.meta.env.VITE_SZAKAL_VERSION);
                return currentVersion.major > shownVersion.major || currentVersion.minor > shownVersion.minor;
        } else {
            return true;
        }
    }

    const mediumSize = useMediumSize();
    const [releaseNotesShown, setReleaseNotesShown] = useState(shouldDisplayReleaseNotes());

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