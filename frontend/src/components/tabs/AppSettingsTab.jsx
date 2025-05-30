import React, {useEffect, useState} from 'react';
import TabHeader from "../misc/TabHeader";
import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    Typography
} from "@mui/joy";
import {useDispatch, useSelector} from "react-redux";
import {useMobileSize} from "../../utils/MediaQuery";
import {changeCampaignAction} from "../../redux/MiscActions";
import {useUserData} from "../../data/UsersData";
import JoinGroupDialog from '../users/groups/JoinGroupDialog';

const AppSettingsTab = () => {

        const {userId} = useSelector(state => state.auth);

        const mobile = useMobileSize();
        const [campaigns, setCampaigns] = useState([]);
        const [joinOpen, setJoinOpen] = useState(false);
        const {user, loading} = useUserData(userId)
        const [campaignValue, setCampaignValue]
            = useState({label: "Wybierz akcje", id: "choose"});
        const dispatch = useDispatch();

        useEffect(() => {
            if (user) {
                const campaigns = []
                for (const [key, value] of Object.entries(user.campaigns)) {
                    campaigns.push({id: key, name: value})
                }
                setCampaigns(campaigns);
            }
        }, [user])

        const campaignsOptions = []
        if (campaigns) {
            campaignsOptions.push(...campaigns.map((campaign) => {
                return {
                    label: campaign.name,
                    id: campaign.id
                }
            }));
        }
        campaignsOptions.push({id: "choose", label: "Wybierz", disabled: true})

        const getLocalStorageCampaign = () => {
            return localStorage.getItem("defaultCampaign")
        }

        const setLocalStorageCampaign = (id) => {
            return localStorage.setItem("defaultCampaign", id)
        }

        useEffect(() => {
            if (campaigns && getLocalStorageCampaign()) {
                const campaign = campaigns.find(campaign => campaign.id === getLocalStorageCampaign());
                if (!campaign) {
                    return;
                }
                setCampaignValue(
                    {
                        id: campaign.id,
                        label: campaign.name
                    });
            }
        }, [campaigns])

        const getOptionDisabled = (option) => {
            return option.disabled
        }

        const isOptionEqualToValue = (option) => {
            return campaignValue.id === option.id
        }

        return (
            <div style={{
                display: "flex",
                overflow: "auto",
                flexDirection: "column",
                paddingBottom: 30
            }}>
                <TabHeader>
                    <Typography level="h2">Ustawienia aplikacji</Typography>
                </TabHeader>
                <div style={{display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start"}}>
                    <Card variant={"outlined"} sx={{padding: 1, minWidth: 200, flex: mobile ? 1 : ""}}>
                        {loading && <CircularProgress/>}
                        {!loading && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setLocalStorageCampaign(campaignValue.id);
                                dispatch(changeCampaignAction(campaignValue.id));
                            }}>
                                <CardContent>
                                    <FormControl>
                                        <FormLabel>
                                            Domyślna akcja
                                        </FormLabel>
                                        <Autocomplete loading={loading}
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
                                </CardContent>
                                <CardActions>
                                    <Button type={"submit"}>Zapisz</Button>
                                </CardActions>
                            </form>
                        )}
                    </Card>
                    <Card variant={"outlined"} sx={{padding: 1, minWidth: 200, flex: mobile ? 1 : ""}}>
                        <Typography>Dołącz do grupy</Typography>
                        <Button onClick={() => setJoinOpen(true)}>Dołącz</Button>
                    </Card>
                    <JoinGroupDialog open={joinOpen} close={() => setJoinOpen(false)}/>
                </div>
            </div>
        );
    }
;

export default AppSettingsTab;