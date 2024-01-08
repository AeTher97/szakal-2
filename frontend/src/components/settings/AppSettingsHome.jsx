import React, {useEffect, useState} from 'react';
import TabHeader from "../main/TabHeader";
import {Autocomplete, Card, CardActions, CardContent, FormControl, FormLabel, Typography} from "@mui/joy";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import Button from "@mui/joy/Button";
import {useCampaignsList} from "../../data/CampaignData";
import {useApplicationSettings} from "../../data/ApplicationSettingsData";
import {useDispatch} from "react-redux";
import {changeCampaignAction} from "../../redux/ReducerActions";

const AppSettingsHome = () => {

    const {campaigns, loading} = useCampaignsList();
    const [campaignValue, setCampaignValue]
        = useState({label: "Wybierz akcje", id: "choose"});
    const {settings, getSetting, setSetting, saveLoading} = useApplicationSettings();
    const dispatch = useDispatch();


    const campaignsOptions = campaigns.map((campaign) => {
        return {
            label: campaign.name,
            id: campaign.id
        }
    });
    campaignsOptions.push({id: "choose", label: "Wybierz", disabled: true})


    useEffect(() => {
        if (campaigns && getSetting("default_campaign")) {
            const campaign = campaigns.find(campaign => campaign.id === getSetting("default_campaign"));
            if(!campaign){
                return;
            }
            setCampaignValue(
                {
                    id: campaign.id,
                    label: campaign.name
                });
        }
    }, [settings])

    const getOptionDisabled = (option) => {
        return option.disabled
    }

    const isOptionEqualToValue = (option) => {
        return campaignValue.id === option.id
    }

    const {hasRight} = useAccessRightsHelper()

    return (
        <div style={{display: "flex", overflow: "auto", flexDirection: "column", paddingBottom: 30}}>
            <TabHeader>
                <Typography level="h2">Ustawienia aplikacji</Typography>
            </TabHeader>
            <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
                <Card variant={"outlined"} sx={{padding: 1, minWidth: 200}}>
                    <form onSubmit={(e) =>{
                        e.preventDefault();
                        setSetting("default_campaign", campaignValue.id);
                        dispatch(changeCampaignAction(campaignValue.id));
                    }}>
                        <FormControl>
                            <FormLabel>
                                Domyślna akcja
                            </FormLabel>
                            <Autocomplete loading={saveLoading}
                                          disableClearable
                                          options={campaignsOptions}
                                          value={campaignValue}
                                          getOptionDisabled={getOptionDisabled}
                                          isOptionEqualToValue={isOptionEqualToValue}
                                          onChange={(e, inputValue) => {
                                              setCampaignValue(inputValue)
                                          }}
                            />
                        </FormControl>
                        <CardContent>
                        </CardContent>
                        <CardActions>
                            <Button type={"submit"}>Zapisz</Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AppSettingsHome;