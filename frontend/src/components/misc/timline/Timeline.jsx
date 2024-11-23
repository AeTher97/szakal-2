import React from 'react';
import PropTypes from "prop-types";

const Timeline = ({children}) => {
    return (
        <div style={{paddingTop: 10, paddingBottom: 10}}>
            {children}
        </div>
    );
};

Timeline.propTypes = {
    children: PropTypes.node.isRequired
}

export default Timeline;