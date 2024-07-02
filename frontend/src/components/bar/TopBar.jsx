import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import SzakalLogo from "./SzakalLogo";
import {Autocomplete} from "@mui/joy";
import {useFullColumnSize, useMobileSize} from "../../utils/SizeQuery";
import UserMenu from "./UserMenu";
import {useCampaignsList} from "../../data/CampaignData";
import {changeCampaignAction} from "../../redux/ReducerActions";
import DrawerMenu from "./DrawerMenu";
import NotificationComponent from "../notifications/NotificationComponent";
import {useApplicationSettings} from "../../data/ApplicationSettingsData";
import {useUserData} from "../../data/UsersData";

const TopBar = () => {

    const {name, surname, userId} = useSelector(state => state.auth);
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {campaigns, loading} = useCampaignsList();
    const {getSetting} = useApplicationSettings();
    const {user} = useUserData(userId)
    const [campaignValue, setCampaignValue]
        = useState({label: "Wybierz akcje", id: "choose"});
    const dispatch = useDispatch();
    const mediumSize = useFullColumnSize();
    const mobile = useMobileSize();

    useEffect(() => {
        if (campaigns && campaigns.length > 0 && getSetting("default_campaign")) {
            const campaign = campaigns.find(campaign => campaign.id === getSetting("default_campaign"));
            if(!campaign){
                return;
            }
            dispatch(changeCampaignAction(campaign.id));
        } else if(!getSetting("default_campaign")){
            dispatch(changeCampaignAction("none"))
        }
    }, [campaigns]);

    const campaignsOptions = campaigns.map((campaign) => {
        return {
            label: campaign.name,
            id: campaign.id
        }
    });
    campaignsOptions.push({id: "choose", label: "Wybierz", disabled: true})


    useEffect(() => {
        if(currentCampaign === "none"){
            return;
        }
        if (campaigns && campaigns.length > 0 && currentCampaign && campaignsOptions.length > 0) {
            setCampaignValue(campaignsOptions.find(campaign => campaign.id === currentCampaign));
        }
    }, [currentCampaign, campaigns])

    const getOptionDisabled = (option) => {
        return option.disabled
    }

    const isOptionEqualToValue = (option) => {
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
            <NotificationComponent/>
            <Autocomplete loading={loading}
                          disableClearable
                          options={campaignsOptions}
                          value={campaignValue}
                          getOptionDisabled={getOptionDisabled}
                          isOptionEqualToValue={isOptionEqualToValue}
                          style={{width: mediumSize ? 1000 : 200, margin: mediumSize ? 10 : 20}}
                          onChange={(e, inputValue) => {
                              dispatch(changeCampaignAction(inputValue.id))
                          }}
            />

            {user && <UserMenu name={name} surname={surname} image={`data:image;base64,${user.profilePicture}`}/>}
        </div>
    );
};

export default TopBar;