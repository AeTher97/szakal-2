import {useData, usePut} from "./UseData";
import {useState} from "react";

export const useUsersList = () => {
    const [users, setUsers] = useState();
    const {loading} = useData(`/users?pageNumber=0`, (data) => setUsers(data.content))

    return {users, loading}
}

export const useUserData = (id) => {
    const [user, setUser] = useState();

    const {loading} = useData(`/users/${id}`,
        (data) => setUser(data),
        id)

    const putRoles = usePut(`/users/${id}/roles`, (content) => setUser(content))
    const putAccepted = usePut(`/users/${id}/accept`, (content) => setUser(content))
    const updateUserRoles = (ids) => {
        putRoles({
            roles: ids
        })
    }

    const acceptUser = () => {
        putAccepted();
    }

    return {loading, user, updateUserRoles, acceptUser}
}