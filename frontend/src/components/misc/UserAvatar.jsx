import React from 'react';
import {Avatar, Typography} from "@mui/joy";
import {useMobileSize} from "../../utils/MediaQuery";
import {uuidToColor} from "../../utils/ColorForUUID";
import PropTypes from "prop-types";

const UserAvatar = ({
                        id,
                        name = "",
                        surname = "",
                        text = true,
                        size,
                        overrideMobile = false,
                        hideName = false,
                        bold = true,
                    }) => {

    const mobile = useMobileSize();

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar style={{backgroundColor: id ? uuidToColor(id, 1) : "primary", color: "white"}}
                    variant={"soft"} src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/${id}/picture`}
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
    text: PropTypes.bool,
    size: PropTypes.string,
    overrideMobile: PropTypes.bool,
    hideName: PropTypes.bool,
    bold: PropTypes.bool,
    id: PropTypes.string.isRequired
};

export default UserAvatar;