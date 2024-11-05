import React from 'react';
import {Card, CardContent, Typography} from "@mui/joy";
import {useMediumSize, useMobileSize} from "../../utils/SizeQuery";
import {useSelector} from "react-redux";

const LogoCard = () => {

    const mobile = useMobileSize();
    const mediumSize = useMediumSize();
    const {theme} = useSelector(state => state.theme);


    return (
        <Card color={"primary"} sx={{
            flex: 1, minWidth: 250,
            maxWidth: (mobile || mediumSize) ? 1000 : 400
        }}>

            <CardContent>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <img src={theme === "dark" ? "/iaeste_white.svg" : "/iaeste.svg"} style={{width: 120}}/>
                </div>
                <Typography level={"body-sm"}>
                    Przed Tobą System Zarządzania Akcjami Komitetu Lokalnego, narzędzie
                    do śledzenia kontaktów z firmami.
                    <br/><br/>
                    Nie mamy jeszcze żadnej instrukcji, ale jeśli ktoś ją
                    stworzy proszę o maila na michael93509@gmail.com.
                    <br/><br/>
                    Jeśli nie masz dostępu do żadnych akcji zgłoś się
                    do swojego koordynatora po kod do grupy. Możesz go wpisać w zakładce ustawienia aplikacji.
                    <br/><br/>
                    Masz jakikolwiek feedback? Użyj przycisku na dole strony.
                    <br/><br/>
                    Pomyślnych kontaktów!
                    <br/>
                    Michał z AGH
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LogoCard;