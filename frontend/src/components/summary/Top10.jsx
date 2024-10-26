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

    let top10List = [];
    Object.keys(top10).forEach(key => {
        top10List.push({name: key, count: top10[key]})
    });

    top10List.sort((a, b) => {
        if (a.count > b.count) {
            return -1;
        } else if (a.count === b.count) {
            return 0;
        } else {
            return 1;
        }
    });


    return (
        <Card invertedColors color={"primary"} variant={"solid"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
            <Typography level={"title-lg"}>Top 10</Typography>
            {!loading && <>
                <Divider inset={"context"}/>
                {top10List.length > 0 && <CardContent>
                    {top10List.map((entry, i) => {
                        return <Typography
                            key={entry.name}>{i + 1}. {entry.name} - {entry.count}</Typography>
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