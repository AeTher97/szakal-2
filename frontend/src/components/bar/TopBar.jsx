import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import SzakalLogo from "./SzakalLogo";
import {useMediumSize, useMobileSize} from "../../utils/SizeQuery";
import UserMenu from "./UserMenu";
import {changeCampaignAction} from "../../redux/ReducerActions";
import DrawerMenu from "./DrawerMenu";
import NotificationComponent from "../notifications/NotificationComponent";
import {useUserData} from "../../data/UsersData";
import {Autocomplete, IconButton, Tooltip} from "@mui/joy";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import JoinGroupDialog from "../users/groups/JoinGroupDialog";

const TopBar = () => {

    const {name, surname, userId, refresh} = useSelector(state => state.auth);
        const {currentCampaign} = useSelector(state => state.campaigns);

    const {user, loading} = useUserData(userId, refresh)
    const [joinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);
        const [campaigns, setCampaigns] = useState([]);
        const [campaignValue, setCampaignValue]
            = useState({label: "Wybierz akcje", id: "choose"});

        const dispatch = useDispatch();
    const mediumSize = useMediumSize();
        const mobile = useMobileSize();

        const campaignsOptions = campaigns.map((campaign) => {
            return {
                label: campaign.name,
                id: campaign.id
            }
        });
        campaignsOptions.push({id: "choose", label: "Wybierz", disabled: true})

        useEffect(() => {
            if (!user) {
                return;
            }
            const campaigns = []
            for (const [key, value] of Object.entries(user.campaigns)) {
                campaigns.push({id: key, name: value})
            }
            setCampaigns(campaigns);

            if (campaigns && campaigns.length > 0) {
                if (getLocalStorageCampaign() && campaigns.map(campaign => campaign.id)
                    .includes(getLocalStorageCampaign())) {
                    dispatch(changeCampaignAction(getLocalStorageCampaign()));
                } else {
                    dispatch(changeCampaignAction(campaigns[0].id))
                }
            }
        }, [loading, user]);

        useEffect(() => {
            if (currentCampaign === "none") {
                return;
            }
            if (campaigns.length > 0 && currentCampaign && campaignsOptions.length > 0) {
                setCampaignValue(campaignsOptions.find(campaign => campaign.id === currentCampaign));
            }
        }, [currentCampaign, campaigns])

    const getLocalStorageCampaign = () => {
        return localStorage.getItem("defaultCampaign")
    }

        const getOptionDisabled = (option) => {
            return option.disabled
        }

        const isOptionEqualToValue = (option) => {
            if (!campaignValue) {
                return false;
            }
            return campaignValue.id === option.id
        }

        return (
            <div style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1
            }}>
                {mediumSize && <DrawerMenu/>}
                {!mobile && <div style={{flex: 1}}>
                    <SzakalLogo/>
                </div>}
                {!mobile && <Tooltip title={"Dołącz do grupy użytkowników"}>
                    <IconButton style={{paddingLeft: 8, paddingRight: 8, marginRight: 3}}
                                onClick={() => setJoinGroupDialogOpen(true)}>
                        <GroupAddIcon/>
                    </IconButton>
                </Tooltip>}
                <NotificationComponent/>
                <Autocomplete loading={loading}
                              disableClearable
                              options={campaignsOptions}
                              value={campaignValue}
                              getOptionDisabled={getOptionDisabled}
                              isOptionEqualToValue={isOptionEqualToValue}
                              style={{width: 200, margin: 10}}
                              onChange={(e, inputValue) => {
                                  dispatch(changeCampaignAction(inputValue.id))
                              }}
                />
                {user && <UserMenu name={name} surname={surname} image={user.profilePicture} id={userId}/>}
                {!mobile && <JoinGroupDialog open={joinGroupDialogOpen} close={() => setJoinGroupDialogOpen(false)}/>}
            </div>
        );
    }
;

export default TopBar;