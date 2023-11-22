import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useRolesList = () => {
    const [roles, setRoles] = useState([]);
    const {loading} = useData(`/roles?pageNumber=0`, (data) => setRoles(data.content));

    const {post} = usePost(`/roles`, (data) => setRoles(current => {
        return [...current, data]
    }))

    const addRole = (name, description) => {
        post({
            name, description, accessRights: []
        })
    }

    return {roles, loading, addRole}
}

export const useRole = (id) => {

    const [role, setRole] = useState(null);
    const {loading} = useData(`/roles/${id}`, (data) => setRole(data));

    const {put, loading: updateRoleLoading} = usePut(`/roles/${id}`, (data) => setRole(data));

    const updateRole = (name, description, accessRights) => {
        return put({
            name,
            description,
            accessRights: accessRights
        })
    }

    return {role, loading, updateRole, updateRoleLoading}
}