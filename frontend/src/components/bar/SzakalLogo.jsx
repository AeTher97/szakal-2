import React from 'react';
import {Typography} from "@mui/joy";

const SzakalLogo = () => {
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10, margin: 20}}>
            <img src={"/logo.svg"} style={{height: 40}}/>
            <Typography level={"title-lg"}>Szakal 2.0</Typography>
        </div>
    );
};

export default SzakalLogo;