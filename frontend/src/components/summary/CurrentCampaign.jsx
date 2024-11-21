import React from 'react';
import {Card, CardContent, CircularProgress, Divider, Typography} from "@mui/joy";
import {useSelector} from "react-redux";
import {useMobileSize} from "../../utils/MediaQuery";
import {useCampaign} from "../../data/CampaignData";
import {formatLocalDate} from "../../utils/DateUtils";

const CurrentCampaign = () => {

    const {currentCampaign} = useSelector(state => state.campaigns);
    const {campaign, loading} = useCampaign(currentCampaign);
    const mobile = useMobileSize();

    if (currentCampaign === "none" || !currentCampaign) {
        return <></>
    }

    return (
        <Card invertedColors color={"primary"} variant={"outlined"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
            {campaign && <Typography level={"title-lg"}>Akcja {campaign.name}</Typography>}

            {campaign && <CardContent>

                <Divider inset={"context"}/>
                <div>
                    <Typography level={"title-md"}>Rozpoczęta: {formatLocalDate(campaign.startDate)}</Typography>
                    <Typography level={"title-md"}>Liczba kontaktów: {campaign.journeyCount}</Typography>
                    {campaign.description && <Typography>Opis: {campaign.description}</Typography>}
                </div>
            </CardContent>}
            {loading && <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress/>
            </div>}
        </Card>
    );
};

export default CurrentCampaign;