import React, {useState} from "react";
import {FormControl, FormLabel, Input, Link, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useDispatch} from "react-redux";
import {saveTokenInStorage} from "../utils/TokenUtils";
import {loginAction} from "../redux/AuthActions";
import {Form} from "react-router-dom";

const LoginForm = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginAction({
            username: username,
            password: password
        }, (authToken, refreshToken, email) => {
            saveTokenInStorage(authToken, refreshToken, email, username)
        }))
    }


    return (
        <Form onSubmit={(e) => handleLogin(e)} style={{
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
                    borderRadius: "sm",
                    boxShadow: "md",
                }}
                variant="outlined">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <img src={"/logo.png"} style={{height: 150, width: 160}}/>
                </div>
                <div>
                    <Typography level="h4" component="h1">
                        <b>Szakal 2.0</b>
                    </Typography>
                    <Typography level="body-sm">Zaloguj się by kontynuować</Typography>
                </div>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="johndoe@email.com"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        // html input attribute
                        name="password"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormControl>

                <Button sx={{mt: 1 /* margin top */}} type={"submit"}>Zaloguj</Button>
                <Typography
                    endDecorator={<Link href="/sign-up">Zarejestruj się</Link>}
                    fontSize="sm"
                    sx={{alignSelf: "center"}}
                >
                    Nie masz konta?
                </Typography>
                <Typography fontSize={"smaller"} sx={{alignSelf: "center"}}>
                    Made by GRAFIKA
                </Typography>
            </Sheet>

        </Form>
    );
};

export default LoginForm;