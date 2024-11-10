import React from 'react';
import {Typography} from "@mui/joy";

const SzakalLogo = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            flexWrap: "nowrap",
            gap: 10,
            margin: 10
        }}>
            <img src={"/szakal_logo.svg"} style={{height: 50}}/>
            <Typography level={"title-lg"}>Szakal 2</Typography>
        </div>
    );
};

export default SzakalLogo;