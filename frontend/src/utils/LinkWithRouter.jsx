import React from 'react';
import Link from '@mui/joy/Link';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';

const LinkWithRouter = ({to, children, overlay, underline, sx, style, color}) => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Link to={to} component={RouterLink} color={color} overlay={overlay} underline={underline} sx={sx}
              style={style}><span
            style={{display: "flex", alignItems: "center", flexDirection: "row", flex: 1}}>{children}</span></Link>
    );
};

LinkWithRouter.propTypes = {};

export default LinkWithRouter;