import React from 'react';

const ContentColumn = props => {
    return (
        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: 800, flex: 1}}>
                {props.children}
            </div>
        </div>
    );
};

export default ContentColumn;