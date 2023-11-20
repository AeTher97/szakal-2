import React from 'react';
import {Card, CardContent, Divider, Typography} from "@mui/joy";
import {useCurrentCampaignJourneyList} from "../../data/JourneyData";
import {useMobileSize} from "../../utils/SizeQuery";

const Top10 = () => {

    const {journeys, loading} = useCurrentCampaignJourneyList()
    const mobile = useMobileSize();

    const top10 = new Map();
    journeys.forEach(journey => {
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


    if (journeys.length > 0) {
        return (
            <Card invertedColors color={"primary"} variant={"solid"} sx={{flex: mobile ? 1 : "", minWidth: 250}}>
                <CardContent>
                    <Typography level={"title-lg"}>Top 10</Typography>
                </CardContent>
                <Divider inset={"context"}/>
                <CardContent>
                    {Array.from(top10, ([name, value]) => ({...value, id: name}))
                        .map((user, i) => {
                            return <Typography
                                key={user.id}>{i + 1}. {user.name} {user.surname} - {user.count}</Typography>
                        })}
                </CardContent>
            </Card>
        );
    } else {

    }
};

export default Top10;