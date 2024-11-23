import {useState} from "react";
import {useData, useDelete, usePost, usePut} from "./UseData";

export const useGroupsList = () => {
    const [groups, setGroups] = useState([]);
    const {loading} = useData(`/groups`, (data) => setGroups(data));

    const {post} = usePost(`/groups`, (data) => setGroups(current => {
        return [...current, data]
    }))

    const {deleteReq} = useDelete(`/groups`)

    const addGroup = (name) => {
        post({
            name
        })
    }

    const removeGroupFromArray = (groups, id) => {
        return [...groups.filter(group => group.id !== id)]
    }

    const deleteGroup = (id) => {
        deleteReq({}, `/groups/${id}`)
            .then(() => {
                setGroups(state => {
                    return removeGroupFromArray(state, id)
                })
            });
    }

    return {groups, addGroup, deleteGroup, loading}
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

export const useJoinGroup = () => {

    const {post} = usePost(`/groups/join`,
        () => {
        });

    return (entryCode) => {
        return post({
            entryCode
        })
    };
}