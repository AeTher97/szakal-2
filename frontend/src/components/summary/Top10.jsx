import React from 'react';
import {Card, CardContent, CircularProgress, Divider, Typography} from "@mui/joy";
import {useCurrentCampaignJourneyList} from "../../data/JourneyData";
import {useMobileSize} from "../../utils/SizeQuery";
import {useSelector} from "react-redux";

const Top10 = () => {

    const {journeys, loading} = useCurrentCampaignJourneyList(0, 1000)
    const mobile = useMobileSize();
    const {currentCampaign} = useSelector(state => state.campaigns);

    if(currentCampaign === "none"){
        return <></>
    }


    const top10 = new Map();
    journeys.forEach(journey => {
        if(!journey.user){
            return;
        }
        const currentStatForUser = top10.get(journey.user.id);
        if (currentStatForUser) {
            top10.set(journey.user.id, {
                ...currentStatForUser,
                count: currentStatForUser.count + 1
            });
        } else {
            top10.set(journey.user.id, {
                name: journey.user.name,
                surname: journey.user.surname,
                count: 1
            })
        }
    })


    return (
        <Card invertedColors color={"primary"} variant={"solid"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
                <Typography level={"title-lg"}>Top 10</Typography>
            {!loading && <>
                <Divider inset={"context"}/>
                {journeys.length > 0 && <CardContent>
                    {Array.from(top10, ([name, value]) => ({...value, id: name}))
                        .sort((a, b) => a.count > b.count ? -1 : 1)
                        .map((user, i) => {
                            return <Typography
                                key={user.id}>{i + 1}. {user.name} {user.surname} - {user.count}</Typography>
                        })}
                </CardContent>}
                {journeys.length === 0 && <Typography>Brak kontatków w akcji</Typography>}
            </>}
            {loading && <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress/>
            </div>}
        </Card>
    );

};

export default Top10;