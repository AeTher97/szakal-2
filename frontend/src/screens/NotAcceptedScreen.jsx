import React from 'react';
import {Link, Typography} from "@mui/joy";
import {useNavigate} from "react-router";

const NotAcceptedScreen = () => {

    const navigate = useNavigate();

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 500,
            flexDirection: "column"
        }}>
            <div style={{display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center"}}>
                <Typography>Nie zostałeś jeszcze zaakceptowany.</Typography>
                <Typography>Skontaktuj się z administratorem</Typography>
            </div>
            <Link onClick={() => {
                navigate("/login")
            }}>Wyloguj</Link>
        </div>
    );
};

export default NotAcceptedScreen;