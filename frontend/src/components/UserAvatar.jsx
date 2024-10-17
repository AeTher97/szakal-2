import React from 'react';
import {Avatar, Typography} from "@mui/joy";
import {useMobileSize} from "../utils/SizeQuery";

const UserAvatar = ({
                        name = "", surname = "", image = "", text = true, size, overrideMobile = false,
                        hideName = false, bold = true
                    }) => {

    const mobile = useMobileSize();

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar variant={"soft"} src={(!image || image.includes("null") || image.includes("undefined"))
                ? null : `data:image;base64,${image}`}
                    size={size}>
                {name[0]}{surname[0]}
            </Avatar>
            {(!mobile || overrideMobile) && text && !hideName &&
                <Typography level={bold ? "title-lg" : "title-md"}>{name} {surname}</Typography>}
        </div>
    );
};

UserAvatar.propTypes = {};

export default UserAvatar;