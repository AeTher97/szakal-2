import {useData, useDelete, usePut} from "./UseData";
import {useState} from "react";
import {useSelector} from "react-redux";

const sortBySurnameAscending = "surname,ASC";
const sortBySurnameDescending = "surname,DESC";

const sortUsersByFullName = (users, directionAscending) => {
    return users.sort((a, b) => {
        const aFullName = `${a.name} ${a.surname}`.toLowerCase();
        const bFullName = `${b.name} ${b.surname}`.toLowerCase();
        if (aFullName < bFullName) {
            return directionAscending ? -1 : 1;
        } else if (aFullName > bFullName) {
            return directionAscending ? 1 : -1;
        } else {
            return 0;
        }
    });
};

export const useUsersList = (page = 0,
                             searchName = "",
                             searchCommittee = "",
                             searchRole = [],
                             sortAsc = true) => {
    const [pageNumber, setPageNumber] = useState();
    const [users, setUsers] = useState();
    const {loading} = useData(`/users`, (data) => {
            const sortedUsers = sortUsersByFullName(data.content, sortAsc);
            setUsers(sortedUsers)
            setPageNumber(data.page.totalPages)
        },
        [page, searchName, searchCommittee, searchRole, sortAsc],
        [{name: "pageNumber", value: page},
            {name: "pageSize", value: 15},
            {name: "searchName", value: searchName},
            {name: "searchCommittee", value: searchCommittee},
            {name: "searchRole", value: searchRole},
            {name: "sort", value: sortAsc ? sortBySurnameAscending : sortBySurnameDescending}
        ])

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

    const {put: putRoles, loading: updateRolesLoading} = usePut(`/users/${id}/roles`,
        (content) => setUser(content))

    const {put: putAccepted, loading: acceptUserLoading} = usePut(`/users/${id}/accept`,
        (content) => setUser(content))

    const {
        put: putPicture,
        loading: updatePictureLoading
    } = usePut(`/users/${id}/picture`)

    const {
        put: putUserStatus,
        loading: changeUserStatusLoading
    } = usePut(`/users/${id}/status`, (content) => setUser(content));

    const {
        put: putUserDetails,
        loading: updateUserDetailsLoading
    } = usePut(`/users/${id}`, (content) => setUser(content));

    const {
        put: putPushToken,
        loading: addPushTokenLoading
    } = usePut(`/users/${id}/add-push-token`);

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

        return putPicture(formData)
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

    const updateUserDetails = (name, surname, email, committee) => {
        return putUserDetails({
            name, surname, email, committee
        })
    }

    const addPushToken = (subscription) => {
        const subscriptionObject = JSON.parse(JSON.stringify(subscription));
        return putPushToken({
            endpoint: subscriptionObject.endpoint,
            p256dh: subscriptionObject.keys.p256dh,
            auth: subscriptionObject.keys.auth
        });
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
        updatePictureLoading,
        deleteNotAcceptedUser,
        addPushToken,
        addPushTokenLoading
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