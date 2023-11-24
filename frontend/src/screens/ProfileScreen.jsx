import React from 'react';
import UserDetails from "../components/users/UserDetails";
import {useSelector} from "react-redux";

const ProfileScreen = () => {

    const {userId} = useSelector(state => state.auth)

    return (
        <div>
            <UserDetails userId={userId}/>
        </div>
    );
};

export default ProfileScreen;