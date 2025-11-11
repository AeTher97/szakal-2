import React from 'react';
import {Link, Typography} from "@mui/joy";
import {useNavigate} from "react-router";

const ConfirmEmailMessageScreen = () => {

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
                <Typography>Został do Ciebie wysłany email z linkiem aktywacyjnym.</Typography>
                <Typography>Proszę kliknij go.</Typography>
            </div>
            <Link onClick={() => {
                navigate("/login")
            }}>Przejdź do logowania</Link>
        </div>
    );
};

export default ConfirmEmailMessageScreen;