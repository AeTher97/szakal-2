import React from 'react';
import {Avatar, Typography} from "@mui/joy";
import {useMobileSize} from "../utils/SizeQuery";

const UserAvatar = ({name, surname, image, text = true}) => {

    const mobile = useMobileSize();

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar variant={"soft"} src={image}>
                {name[0]}{surname[0]}
            </Avatar>
            {!mobile && text && <Typography level={"title-lg"}>{name} {surname}</Typography>}
        </div>
    );
};

UserAvatar.propTypes = {};

export default UserAvatar;