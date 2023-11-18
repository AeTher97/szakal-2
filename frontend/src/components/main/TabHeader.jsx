import React from 'react';

const TabHeader = ({children}) => {
    return (
        <div style={{padding: 10, display: "flex", justifyContent: "space-between"}}>
            {children}
        </div>
    );
};

export default TabHeader;