import {useData, useDelete, usePut} from "./UseData";
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

export const useUsersSearch = (phrase) => {
    const [users, setUsers] = useState([]);
    const {loading} = useData(`/users/search`, (data) => {
            setUsers(data)
        },
        [phrase], [{name: "phrase", value: phrase}])

    return {users, loading}

}

export const useUserData = (id, refresh) => {
    const [user, setUser] = useState();

    const {loading} = useData(`/users/${id}`,
        (data) => setUser(data), [id, refresh])

    const {put: putRoles, loading: updateRolesLoading} = usePut(`/users/${id}/roles`, (content) => setUser(content))
    const {put: putAccepted, loading: acceptUserLoading} = usePut(`/users/${id}/accept`, (content) => setUser(content))
    const {put: putPicture, loading: updatePictureLoading} = usePut(`/users/${id}/picture`, (content) => setUser(content))
    const {
        put: putUserStatus,
        loading: changeUserStatusLoading
    } = usePut(`/users/${id}/status`, (content) => setUser(content))
    const {
        put: putUserDetails,
        loading: updateUserDetailsLoading
    } = usePut(`/users/${id}`, (content) => setUser(content))
    const {deleteReq} = useDelete(`/users/${id}`, () => setUser(null))

    const updateUserRoles = (ids) => {
        putRoles({
            roles: ids
        })
    }

    const updateProfilePicture = (picture) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("file", picture);

        putPicture(formData)
    }

    const acceptUser = () => {
        return putAccepted();
    }

    const deleteNotAcceptedUser = () => {
        return deleteReq();
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
        updateUserDetailsLoading,
        updateProfilePicture,
        deleteNotAcceptedUser
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