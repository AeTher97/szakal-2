import React from 'react';
import Top10 from "./Top10";
import TabHeader from "../main/TabHeader";
import {Typography} from "@mui/joy";
import CurrentCampaign from "./CurrentCampaign";
import LogoCard from "./LogoCard";
import {useMobileSize} from "../../utils/SizeQuery";

const SummaryHome = () => {

    const {mobile} = useMobileSize();

    return (
        <div>
            <TabHeader>
                <Typography level={"h2"}>Witaj w Szakal 2.0</Typography>
            </TabHeader>
            <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                flexDirection: mobile ? "column" : "row",
                alignItems: "stretch",
                gap: 10,
                paddingBottom: 100,
                overflow: "hidden"
            }}>
                <LogoCard/>
                <CurrentCampaign/>
                <Top10/>
            </div>
        </div>
    );
};

export default SummaryHome;