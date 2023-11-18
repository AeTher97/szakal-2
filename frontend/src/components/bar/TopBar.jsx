import React, {useEffect} from 'react';
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
    const dispatch = useDispatch();
    const mobile = useMobileSize();

    useEffect(() => {
        if (!loading && campaigns[0]) {
            dispatch(changeCampaignAction(campaigns[0].id))
        }
    }, [loading]);

    const campaignsOptions = campaigns.map((campaign) => {
        return {
            label: campaign.name,
            id: campaign.id
        }
    });

    const campaignValue = campaignsOptions.length > 0 && currentCampaign ? campaignsOptions.find(campaign => campaign.id === currentCampaign)
        : {label: "Wybierz", id: "choose"};

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