import React from 'react';

const TabHeader = ({children, style}) => {
    return (
        <div style={{padding: "10px 0 10px 0", display: "flex", justifyContent: "space-between", ...style}}>
            {children}
        </div>
    );
};

export default TabHeader;