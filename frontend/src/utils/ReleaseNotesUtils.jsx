import {Typography} from "@mui/joy";
import React from "react";
import PropTypes from "prop-types";
import {useTheme} from "@emotion/react";

export const ReleaseNotesTitle = ({title}) => {
    return (
        <Typography
            id="modal-title"
            level="h2"
            sx={{fontWeight: 'lg', mb: 1}}
        >
            {title}
        </Typography>
    );
};


export const ReleaseNotesSection = ({title, children}) => {

    const theme = useTheme();
        
    return (
        <div>
            <Typography level={"title-lg"}>
                {title}
            </Typography>
            <ul style={{color: theme.vars.palette.text.primary}}>
                {children}
            </ul>
        </div>
    );
};


export const ReleaseNotesBullet = ({title, description}) => {
    return <li>
        <Typography level={"title-md"}>{title}</Typography>
        {description && <Typography level={"body-sm"}>{description}</Typography>}
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