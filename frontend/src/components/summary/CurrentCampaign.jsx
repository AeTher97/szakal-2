import React from 'react';
import {Card, CardContent, CircularProgress, Divider, Typography} from "@mui/joy";
import {useSelector} from "react-redux";
import {useMobileSize} from "../../utils/SizeQuery";
import {useCampaign} from "../../data/CampaignData";
import {formatLocalDate} from "../../utils/DateUtils";

const CurrentCampaign = () => {

    const {currentCampaign} = useSelector(state => state.campaigns);
    const {campaign, loading} = useCampaign(currentCampaign);
    const mobile = useMobileSize();

    if(currentCampaign === "none" || !currentCampaign){
        return <></>
    }

    return (
        <Card invertedColors color={"primary"} variant={"outlined"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
            <CardContent>
                {campaign && <Typography level={"title-lg"}>Akcja {campaign.name}</Typography>}
            </CardContent>

            <Divider inset={"context"}/>
            {campaign && <CardContent>
                <div>
                    <Typography>Rozpoczęta: {formatLocalDate(campaign.startDate)}</Typography>
                    <Typography level={"title-md"}>{campaign.description}</Typography>
                </div>
            </CardContent>}
            {loading && <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress/>
            </div>}
        </Card>
    );
};

export default CurrentCampaign;