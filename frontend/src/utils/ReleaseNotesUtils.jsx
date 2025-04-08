import {Typography} from "@mui/joy";
import React from "react";
import PropTypes from "prop-types";

export const ReleaseNotesTitle = ({title}) => {
    return (
        <Typography
            component="h2"
            id="modal-title"
            level="h3"
            textColor="inherit"
            sx={{fontWeight: 'lg', mb: 1}}
        >
            {title}
        </Typography>
    );
};


export const ReleaseNotesSection = ({title, children}) => {
    return (
        <div>
            <Typography level={"h3"}>
                {title}
            </Typography>
            <ul>
                {children}
            </ul>
        </div>
    );
};


export const ReleaseNotesBullet = ({title, description}) => {
    return <li>
        <Typography level={"h4"}>{title}</Typography>
        {description && <Typography level={"body-md"}>{description}</Typography>}
    </li>
}

ReleaseNotesTitle.propTypes = {
    title: PropTypes.string.isRequired,
}

ReleaseNotesSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}


ReleaseNotesBullet.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
}