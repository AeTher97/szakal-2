import React from 'react';
import {Link, Typography} from "@mui/joy";
import {useMobileSize} from "../utils/SizeQuery";

const Footer = () => {
    const mobile = useMobileSize();



    return (
        <div style={{display:"flex",
            justifyContent:"center",
            alignItems: "center",
            flexDirection: mobile ? "column" : "row", gap: 5,
        justifySelf: "flex-end"}}>
            <Typography level={"body-xs"}>
                Made by GRAFIKA AGH 2024
            </Typography>
            <Typography level={"body-xs"} >
                Dostrzegłeś jakiś problem lub masz pomysł?
                <Link style={{marginLeft: 5}}
                      href={"https://docs.google.com/forms/d/e/1FAIpQLSeQt6DTLyoIZO0ZJAvipBO7FtXZMqeNMMIzU7MT02NOza9MCg/viewform?usp=sf_link"}>
                Kliknij tutaj
            </Link>
            </Typography>
        </div>
    );
};

export default Footer;