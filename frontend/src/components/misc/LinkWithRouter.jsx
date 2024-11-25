import React from 'react';
import Link from '@mui/joy/Link';
import {Link as RouterLink} from 'react-router';
import PropTypes from "prop-types";

const LinkWithRouter = ({to, children, overlay, underline, sx, style, color}) => {

    return (
        <Link to={to} component={RouterLink} color={color} overlay={overlay} underline={underline} sx={sx}
              style={style}><span
            style={{display: "flex", alignItems: "center", flexDirection: "row", flex: 1}}>{children}</span></Link>
    );
};

LinkWithRouter.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    overlay: PropTypes.bool,
    underline: PropTypes.string,
    sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    style: PropTypes.object,
    color: PropTypes.string
};

export default LinkWithRouter;