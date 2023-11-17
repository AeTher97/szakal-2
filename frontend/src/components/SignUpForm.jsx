import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {FormControl, FormLabel, Input, Link, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useRegister} from "../data/UserData";


const SignUpForm = () => {

    const {registerUser} = useRegister();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState();
    const [surname, setSurname] = useState();

    return (
        <form style={{
            display: "flex",
            justifyContent: "center"
        }}
              onSubmit={(e) => {
                  e.preventDefault();
                  registerUser({
                      email,
                      username,
                      name,
                      surname,
                      password,
                      repeatPassword
                  }).then(() => {
                      navigate("/login")
                  }).catch(e => {
                      console.log(e)
                  });

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
                <div>
                    <Typography level="h4" component="h1">
                        <b>Szakal 2.0</b>
                    </Typography>
                    <Typography level="body-sm">Zarejestruj się</Typography>
                </div>
                <FormControl>
                    <FormLabel>E-mail</FormLabel>
                    <Input
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="jankowalski@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Nazwa użytkownika</FormLabel>
                    <Input
                        // html input attribute
                        name="username"
                        type="text"
                        placeholder="jankowalski"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Imię</FormLabel>
                    <Input
                        // html input attribute
                        name="name"
                        type="text"
                        placeholder="Jan"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Nazwisko</FormLabel>
                    <Input
                        // html input attribute
                        name="surname"
                        type="text"
                        placeholder="Kowalski"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Hasło</FormLabel>
                    <Input
                        // html input attribute
                        name="password"
                        type="password"
                        placeholder="haslo"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Powtórz Hasło</FormLabel>
                    <Input
                        // html input attribute
                        name="password"
                        type="password"
                        placeholder="haslo"
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
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

        </form>
    );
};

export default SignUpForm;