import React from 'react';
import PropTypes from "prop-types";

const TabHeader = ({children, style}) => {
    return (
        <div style={{padding: "10px 0 10px 0", display: "flex", justifyContent: "space-between", alignItems: "center", ...style}}>
            {children}
        </div>
    );
};

TabHeader.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
}

export default TabHeader;