import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import SzakalLogo from "./SzakalLogo";
import {Autocomplete} from "@mui/joy";
import {useMobileSize} from "../../utils/SizeQuery";
import UserMenu from "./UserMenu";
import {useCampaignsList} from "../../data/CampaignData";
import {changeCampaignAction} from "../../redux/ReducerActions";
import DrawerMenu from "./DrawerMenu";

const TopBar = () => {

    const {name, surname} = useSelector(state => state.auth);
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {campaigns, loading} = useCampaignsList();
    const [campaignValue, setCampaignValue] = useState({label: "Wybierz akcje", id: "choose"});
    const dispatch = useDispatch();
    const mobile = useMobileSize();

    useEffect(() => {
        if (campaigns && campaigns.length > 0) {
            dispatch(changeCampaignAction(campaigns[0].id))
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
            {!mobile && <div style={{flex: 1}}>
                <SzakalLogo/>
            </div>}
            {mobile && <DrawerMenu/>}
            <Autocomplete loading={loading}
                          disableClearable
                          options={campaignsOptions}
                          value={campaignValue}
                          getOptionDisabled={getOptionDisabled}
                          isOptionEqualToValue={isOptionEqualToValue}
                          style={{width: mobile ? 1000 : 200, margin: mobile ? 10 : 20}}
                          onChange={(e, inputValue) => {
                              dispatch(changeCampaignAction(inputValue.id))
                          }}
            />

            <UserMenu name={name} surname={surname}/>
        </div>
    );
};

export default TopBar;