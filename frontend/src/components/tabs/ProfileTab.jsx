import React from 'react';
import UserDetails from "../users/UserDetails";
import {useSelector} from "react-redux";

const ProfileTab = () => {

    const {userId} = useSelector(state => state.auth)

    return (
        <div>
            <UserDetails userId={userId}/>
        </div>
    );
};

export default ProfileTab;