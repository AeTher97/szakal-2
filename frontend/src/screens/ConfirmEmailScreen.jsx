import React, {useEffect, useState} from 'react';
import {CircularProgress, Typography} from "@mui/joy";
import {useSearchParams} from "react-router";
import {useConfirmEmail} from "../data/AuthenticationData";
import LinkWithRouter from "../components/misc/LinkWithRouter";

const ConfirmEmailScreen = () => {

    const [search] = useSearchParams();
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const {confirmEmail} = useConfirmEmail();

    useEffect(() => {
        const code = search.get("code");
        if (code) {
            confirmEmail(code).then(() => {
                setEmailConfirmed(true);
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
            {emailConfirmed ?
                <Typography>
                    Dziękujemy za potwierdzenie adresu E-mail. Możesz się teraz <LinkWithRouter
                    to={"/login"}>zalogować.</LinkWithRouter>
                </Typography> :
                <CircularProgress/>}
        </div>
    );
};

export default ConfirmEmailScreen;