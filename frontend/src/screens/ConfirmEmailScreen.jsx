import React, {useEffect} from 'react';
import {CircularProgress} from "@mui/joy";
import {useNavigate, useSearchParams} from "react-router";
import {useConfirmEmail} from "../data/AuthenticationData";

const ConfirmEmailScreen = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const {confirmEmail} = useConfirmEmail();

    useEffect(() => {
        const code = search.get("code");
        if (code) {
            confirmEmail(code).then(() => {
                navigate("/login");
            })
        }
    }, [search]);


    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 500,
            flexDirection: "column"
        }}>
            <CircularProgress/>
        </div>
    );
};

export default ConfirmEmailScreen;