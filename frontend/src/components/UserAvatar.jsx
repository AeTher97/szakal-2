import React from 'react';
import {Avatar, Typography} from "@mui/joy";

const UserAvatar = ({name, surname}) => {

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar variant={"soft"}/>
            <Typography level={"title-lg"}>{name} {surname}</Typography>
        </div>
    );
};

UserAvatar.propTypes = {};

export default UserAvatar;