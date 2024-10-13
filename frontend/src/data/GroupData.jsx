import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useGroupsList = () => {
    const [groups, setGroups] = useState([]);
    const {loading} = useData(`/groups`, (data) => setGroups(data));

    const {post} = usePost(`/roles`, (data) => setGroups(current => {
        return [...current, data]
    }))

    // const addRole = (name, description) => {
    //     post({
    //         name, description, accessRights: []
    //     })
    // }

    return {groups, loading}
}

export const useGroup = (id) => {

    const [group, setGroup] = useState(null);
    const {loading} = useData(`/groups/${id}`, (data) => setGroup(data));

    const {put: putUsers, loading: updateUsersLoading} = usePut(`/groups/${id}`,
        (data) => setGroup(data));

    const {put: putCampaigns, loading: updateCampaignsLoading} = usePut(`/groups/${id}`,
        (data) => setGroup(data));

    const updateUsers = (userList) => {
        return putUsers({
            userList
        })
    }

    const updateCampaigns = (campaignList) => {
        return putCampaigns({
            campaignList
        })
    }

    return {group, updateUsers, updateCampaigns, loading, updateUsersLoading, updateCampaignsLoading}
}