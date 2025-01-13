import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router";
import {useDispatch} from "react-redux";
import {addKnownItem, removeKnownItem} from "../../../redux/MiscActions";
import TabHeader from "../../misc/TabHeader";
import {LinearProgress, Typography} from "@mui/joy";
import {useGroup} from "../../../data/GroupsData";
import GroupUsers from "./GroupUsers";
import GroupCampaigns from "./GroupCampaigns";
import {useMobileSize} from "../../../utils/MediaQuery";

const GroupDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const { group, loading, updateUsers, updateCampaigns, updateUsersLoading, updateCampaignsLoading }
        = useGroup(location.pathname.split("/")[4]);
    const [localGroup, setLocalGroup] = useState(null);
    const mobile = useMobileSize();

    useEffect(() => {
        if (group) {
            dispatch(addKnownItem(location.pathname.split("/")[4], `${group.name}`));
            return () => {
                dispatch(removeKnownItem(location.pathname.split("/")[4]))
            }
        }
    }, [location, group]);

    useEffect(() => {
        setLocalGroup(group)
    }, [group])

    const addUser = (user) => {
        const newUsers = localGroup.userList;
        newUsers.push(user);
        setLocalGroup({
            ...localGroup,
            userList: newUsers
        })
    }

    const deleteUser = (id) => {
        const newUsers = localGroup.userList.filter(user => {
            return user.id !== id
        });
        setLocalGroup({
            ...localGroup,
            userList: newUsers
        })
    }

    const saveUsers = () => {
        updateUsers(localGroup.userList.map(user => user.id))
    }

    const addCampaign = (campaign) => {
        const newCampaigns = localGroup.campaignList;
        newCampaigns.push(campaign);
        setLocalGroup({
            ...localGroup,
            campaignList: newCampaigns
        })
    }

    const deleteCampaign = (id) => {
        const newCampaigns = localGroup.campaignList.filter(campaign => {
            return campaign.id !== id
        });
        setLocalGroup({
            ...localGroup,
            campaignList: newCampaigns
        })
    }

    const saveCampaigns = () => {
        updateCampaigns(localGroup.campaignList.map(campaign => campaign.id))
    }

    return (
        <div style={{ overflow: "auto" }}>
            {group && <TabHeader>
                <Typography level={"h2"}>Grupa {group.name}</Typography>
                <Typography>Kod dostępu: {group.entryCode}</Typography>
            </TabHeader>}
            {loading && <LinearProgress />}
            {group && localGroup && <div style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                alignItems: "stretch",
                gap: 10,
                paddingBottom: mobile ? 0 : 100,
                overflow: "hidden"
            }}>
                {localGroup && <GroupUsers localGroup={localGroup}
                    addUser={addUser} deleteUser={deleteUser}
                    save={saveUsers} saveLoading={updateUsersLoading}
                />}
                {localGroup && <GroupCampaigns groupCampaigns={localGroup.campaignList}
                    save={saveCampaigns} saveLoading={updateCampaignsLoading}
                    addCampaign={addCampaign} deleteCampaign={deleteCampaign} />}
            </div>}
        </div>
    );
};

export default GroupDetails;