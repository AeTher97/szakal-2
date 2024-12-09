import React, {useState} from 'react';
import UserDetails from "../users/UserDetails";
import {useSelector} from "react-redux";
import {useCategories} from "../../data/CategoriesData";
import {LinearProgress, Typography} from "@mui/joy";
import {CATEGORY_MODIFICATION} from "../../utils/AccessRightsList";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import TabHeader from "../misc/TabHeader";

const ProfileTab = () => {
    const [currentPage] = useState(1);
    const {loading}
        = useCategories(true, currentPage - 1);
    const {userId} = useSelector(state => state.auth)

    return (
        <div>
            <UserDetails userId={userId}/>
            <LinearProgress style={{visibility: loading ? "visible" : "hidden"}}/>
        </div>
    );
};

export default ProfileTab;