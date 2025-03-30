import React from 'react';
import {Typography} from "@mui/joy";

const NotFoundScreen = () => {
    return (
        <div style={{
            height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
            flexDirection: "column"
        }}>
            <Typography level={"h1"} style={{rotate: "90deg"}}>:(</Typography>
            <Typography level={"h1"}>Nie mamy takiej strony</Typography>
        </div>
    );
};

export default NotFoundScreen;