import React from 'react';
import Top10 from "../summary/Top10";
import TabHeader from "../misc/TabHeader";
import {Typography} from "@mui/joy";
import CurrentCampaign from "../summary/CurrentCampaign";
import LogoCard from "../summary/LogoCard";
import {useMobileSize} from "../../utils/MediaQuery";


const SummaryTab = () => {

    const mobile = useMobileSize();
``
    return (
        <div>
            <TabHeader>
                <Typography level={"h2"}>Witaj w Szakal 2</Typography>
            </TabHeader>
            <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                flexDirection: mobile ? "column" : "row",
                alignItems: "stretch",
                gap: 10,
                paddingBottom: mobile ? 0 : 100,
                overflow: "hidden"
            }}>
                <LogoCard/>
                <CurrentCampaign/>
                <Top10/>
            </div>
        </div>
    );
};

export default SummaryTab;