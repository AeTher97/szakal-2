import React from 'react';
import PropTypes from "prop-types";

const Timeline = ({children, testId}) => {
    return (
        <div data-testid={testId} style={{paddingTop: 10, paddingBottom: 10}}>
            {children}
        </div>
    );
};

Timeline.propTypes = {
    children: PropTypes.node.isRequired,
    testId: PropTypes.string,
}

export default Timeline;