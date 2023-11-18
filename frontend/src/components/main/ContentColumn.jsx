import React from 'react';

const ContentColumn = props => {
    return (
        <div style={{
            width: "100%", height: "100%",
            display: "flex", justifyContent: "center", alignItems: "stretch", overflow: "hidden"
        }}>
            <div style={{
                maxWidth: 1200, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column",
                padding: 10
            }}>
                {props.children}
            </div>
        </div>
    );
};

export default ContentColumn;