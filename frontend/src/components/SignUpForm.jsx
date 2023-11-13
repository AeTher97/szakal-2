import React, {useState} from 'react';
import {Form} from "react-router-dom";
import {FormControl, FormLabel, Input, Link, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";

const SignUpForm = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Form style={{
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
                    <Typography level="body-sm">Zarejestruj się</Typography>
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
                    endDecorator={<Link href="/login">Zaloguj się</Link>}
                    fontSize="sm"
                    sx={{alignSelf: "center"}}
                >
                    Masz juz konto?
                </Typography>
                <Typography fontSize={"smaller"} sx={{alignSelf: "center"}}>
                    Made by GRAFIKA
                </Typography>
            </Sheet>

        </Form>
    );
};

export default SignUpForm;