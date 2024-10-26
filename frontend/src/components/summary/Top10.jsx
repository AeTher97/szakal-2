import React from 'react';
import {Card, CardContent, CircularProgress, Divider, Typography} from "@mui/joy";
import {useTop10} from "../../data/JourneyData";
import {useMobileSize} from "../../utils/SizeQuery";
import {useSelector} from "react-redux";

const Top10 = () => {

    const mobile = useMobileSize();
    const {top10, loading} = useTop10()
    const {currentCampaign} = useSelector(state => state.campaigns);

    if (currentCampaign === "none" || !currentCampaign) {
        return <></>
    }

    return (
        <Card invertedColors color={"primary"} variant={"solid"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
                <Typography level={"title-lg"}>Top 10</Typography>
            {!loading && <>
                <Divider inset={"context"}/>
                {Object.keys(top10).length > 0 && <CardContent>
                    {Object.keys(top10).map((key, i) => {
                            return <Typography
                                key={key}>{i + 1}. {key} - {top10[key]}</Typography>
                        })}
                </CardContent>}
                {top10.length === 0 && <Typography>Brak kontatków w akcji</Typography>}
            </>}
            {loading && <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress/>
            </div>}
        </Card>
    );

};

export default Top10;