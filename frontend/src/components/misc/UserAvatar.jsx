import React from 'react';
import {Avatar, Typography} from "@mui/joy";
import {useMobileSize} from "../../utils/MediaQuery";
import {uuidToColor} from "../../utils/ColorForUUID";
import PropTypes from "prop-types";

const UserAvatar = ({
                        name = "",
                        surname = "",
                        image = "",
                        text = true,
                        size,
                        overrideMobile = false,
                        hideName = false,
                        bold = true,
                        id
                    }) => {

    const mobile = useMobileSize();

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar style={{backgroundColor: id ? uuidToColor(id, 1) : "primary", color: "white"}}
                    variant={"soft"} src={(!image || image.includes("null") || image.includes("undefined"))
                ? null : `data:image;base64,${image}`}
                    size={size}>
                {name[0]}{surname[0]}
            </Avatar>
            {(!mobile || overrideMobile) && text && !hideName &&
                <Typography level={bold ? "title-lg" : "title-md"}>{name} {surname}</Typography>}
        </div>
    );
};

UserAvatar.propTypes = {
    name: PropTypes.string,
    surname: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.string,
    size: PropTypes.string,
    overrideMobile: PropTypes.bool,
    hideName: PropTypes.bool,
    bold: PropTypes.bool,
    id: PropTypes.string.isRequired
};

export default UserAvatar;