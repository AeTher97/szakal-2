import {useData, usePut} from "./UseData";
import {useState} from "react";
import {useSelector} from "react-redux";

export const useUsersList = (page = 0) => {
    const [pageNumber, setPageNumber] = useState();
    const [users, setUsers] = useState();
    const {loading} = useData(`/users`, (data) => {
            setUsers(data.content)
            setPageNumber(data.totalPages)
        },
        [page], [{name: "pageNumber", value: page}])

    return {users, loading, pageNumber}
}

export const useUserData = (id) => {
    const [user, setUser] = useState();

    const {loading} = useData(`/users/${id}`,
        (data) => setUser(data), [id])

    const {put: putRoles, loading: updateRolesLoading} = usePut(`/users/${id}/roles`, (content) => setUser(content))
    const {put: putAccepted, loading: acceptUserLoading} = usePut(`/users/${id}/accept`, (content) => setUser(content))
    const {
        put: putUserStatus,
        loading: changeUserStatusLoading
    } = usePut(`/users/${id}/status`, (content) => setUser(content))
    const {
        put: putUserDetails,
        loading: updateUserDetailsLoading
    } = usePut(`/users/${id}`, (content) => setUser(content))
    const updateUserRoles = (ids) => {
        putRoles({
            roles: ids
        })
    }

    const acceptUser = () => {
        return putAccepted();
    }

    const changeUserStatus = (status) => {
        return putUserStatus({
            active: status
        })
    }

    const updateUserDetails = (name, surname, email) => {
        return putUserDetails({
            name, surname, email
        })
    }

    return {
        loading,
        user,
        updateUserRoles,
        updateRolesLoading,
        acceptUser,
        acceptUserLoading,
        changeUserStatus,
        changeUserStatusLoading,
        updateUserDetails,
        updateUserDetailsLoading
    }
}

export const usePasswordChange = (id) => {

    const {put, loading: changePasswordLoading} = usePut(`/users/${id}/password`)

    const changePassword = (oldPassword, password, repeatPassword) => {
        return put({
            currentPassword: oldPassword,
            password,
            repeatPassword
        })
    }

    return {changePassword, changePasswordLoading}
}

export const useIsUser = (id) => {
    const {userId} = useSelector(state => state.auth)

    return id ? id === userId : false;
}