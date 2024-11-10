import React from 'react';
import TimelineArrow from "./TimelineArrow";

const Timeline = ({children}) => {
    return (
        <div style={{paddingTop: 10, paddingBottom: 10}}>
            <TimelineArrow/>
            {children}
        </div>
    );
};

export default Timeline;