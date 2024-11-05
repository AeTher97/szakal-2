import React from 'react';
import {Link, Typography} from "@mui/joy";
import {useMobileSize} from "../utils/SizeQuery";

const Footer = () => {
    const mobile = useMobileSize();


    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: mobile ? "column" : "row", gap: 5,
            justifySelf: "flex-end"
        }}>
            <Typography level={"body-xs"}>
                Made by
            </Typography>
            <p className={"rainbow-text"} style={{
                fontSize: "var(--Typography-fontSize, var(--joy-fontSize-xs, 0.75rem))",
                fontWeight: "var(--joy-fontWeight-md, 500)", lineHeight: "var(--joy-lineHeight-md, 1.5)", margin: 0
            }}>
                GRAFIKA AGH
            </p>
            <Typography level={"body-xs"}>
                {new Date().getFullYear()}
            </Typography>
            <Typography level={"body-xs"}>
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