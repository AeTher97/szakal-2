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

    const deleteGroup = (id) => {
        deleteReq({}, `/groups/${id}`)
            .then(() => {
                setGroups(state => {
                    return [...state.filter(group => group.id !== id)]
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

    const {post, loading} = usePost(`/groups/join`,
        (data) => {});

    const joinGroup = (entryCode) => {
        return post({
            entryCode
        })
    }

    return joinGroup;
}