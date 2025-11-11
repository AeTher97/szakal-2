import React, {useState} from "react";
import {FormControl, FormLabel, Input, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useDispatch, useSelector} from "react-redux";
import LinkWithRouter from "../misc/LinkWithRouter";
import {loginAction} from "../../redux/AuthActions";
import PropTypes from "prop-types";
import {UseFieldValidation} from "../../utils/UseFieldValidation";
import {InputWithLimit} from "../misc/InputWithLimit";
import {useMobileSize} from "../../utils/MediaQuery";

const LoginForm = ({redirectBack}) => {

    const email = UseFieldValidation()
    const [password, setPassword] = useState("");
    const {error} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const mobile = useMobileSize();

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginAction({
            username: email.value,
            password: password
        }, (response) => {
            redirectBack(response.accepted);
        }))
    }


    return (
        <form onSubmit={(e) => handleLogin(e)} style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <Sheet
                sx={{
                    maxWidth: 330,
                    flex: 1,
                    mx: 1,
                    my: 4,
                    py: 3,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: "lg",
                    boxShadow: "md",
                }}
                variant="outlined">
                <div style={{display: "flex", justifyContent: "center", marginBottom: 0, marginTop: 5}}>
                    <img alt={"Szakal logo"} src={"/szakal_logo.svg"}
                         style={{height: mobile ? 150 : 250, width: mobile ? 150 : 250}}/>
                </div>
                <div>
                    <Typography level="h4" component="h1">
                        <b>Szakal 2</b>
                    </Typography>
                    <Typography level="body-sm">Zaloguj się by kontynuować</Typography>
                </div>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <InputWithLimit
                        data-testid="cypress-login-email"
                        color={error ? "danger" : "neutral"}
                        name="email"
                        type="email"
                        placeholder="Adres E-mail"
                        value={email.value}
                        limit={email.limit}
                        isValid={email.isValid}
                        onChange={email.handleChange}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        data-testid={"cypress-login-password"}
                        color={error ? "danger" : "neutral"}
                        name="password"
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormControl>

                <Button sx={{mt: 1 /* margin top */}}
                        data-testid={"cypress-login-button"}
                        type={"submit"}>Zaloguj</Button>
                <Typography
                    endDecorator={<LinkWithRouter to="/sign-up">Zarejestruj się</LinkWithRouter>}
                    fontSize="sm"
                    sx={{alignSelf: "center"}}
                >
                    Nie masz konta?
                </Typography>
                <Typography
                    endDecorator={<LinkWithRouter to="/reset-password">Zresetuj je</LinkWithRouter>}
                    fontSize="sm"
                    sx={{alignSelf: "center"}}
                >
                    Nie pamiętasz hasła?
                </Typography>
                <div style={{display: "flex", justifyContent: "center", gap: 5}}>
                    <Typography fontSize={"smaller"} sx={{alignSelf: "center"}}>
                        Made by
                    </Typography>
                    <p className={"rainbow-text"} style={{
                        fontSize: "smaller",
                        margin: 0,
                        position: "relative",
                    }}>
                        GRAFIKA AGH
                    </p>
                    <Typography fontSize={"smaller"} sx={{alignSelf: "center"}}>
                        {new Date().getFullYear()}
                    </Typography>
                </div>
            </Sheet>

        </form>
    );
};

LoginForm.propTypes = {
    redirectBack: PropTypes.func
}

export default LoginForm;