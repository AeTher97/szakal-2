import React from 'react';

const TimelineConnector = ({top}) => {
    return (
        <div style={{
            width: 2,
            flex: 1,
            marginTop: top ? 5 : 0,
            marginBottom: top ? 0 : 5,
            backgroundColor: "rgba(120,120,120,1)"
        }}/>

    );
};

export default TimelineConnector;