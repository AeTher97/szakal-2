import React, {useState} from 'react';
import {useNavigate} from "react-router";
import {FormControl, FormHelperText, FormLabel, Input, LinearProgress, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useRegister} from "../../data/AuthenticationData";
import {Key} from "@mui/icons-material";
import LinkWithRouter from "../misc/LinkWithRouter";
import {InputWithLimit} from "../misc/InputWithLimit";
import {UseFieldValidation} from "../../utils/UseFieldValidation";
import {UseFormValidation} from "../../utils/UseFormValidation";
import {showError} from "../../redux/AlertActions";
import {useDispatch} from "react-redux";


const SignUpForm = () => {

    const {registerUser} = useRegister();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = UseFieldValidation();
    const name = UseFieldValidation();
    const surname = UseFieldValidation();
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const minLength = 15;

    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);

    const isFormValid = UseFormValidation([email, name, surname]) && !passwordsDontMatch && !passwordTooShort;

    return (
        <form style={{
            display: "flex",
            justifyContent: "center"
        }}
              onSubmit={(e) => {
                  e.preventDefault();
                  if (!isFormValid) {
                      return
                  }

                  registerUser({
                      email: email.value,
                      name: name.value,
                      surname: surname.value,
                      password,
                      repeatPassword
                  }).then(() => {
                      navigate("/confirm-email-message")
                  }).catch(e => {
                      dispatch(showError("Nie udało się zarejestrować użytkownika"))
                      console.error(e)
                  });

              }
              }>
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
                        <b>Szakal 2</b>
                    </Typography>
                    <Typography level="body-sm">Zarejestruj się</Typography>
                </div>
                <FormControl required>
                    <FormLabel>E-mail</FormLabel>
                    <InputWithLimit
                        autoFocus
                        required
                        name="email"
                        type="email"
                        placeholder="jankowalski@email.com"
                        value={email.value}
                        limit={email.limit}
                        isValid={email.isValid}
                        onChange={email.handleChange}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Imię</FormLabel>
                    <InputWithLimit
                        required
                        name="name"
                        type="text"
                        placeholder="Jan"
                        value={name.value}
                        limit={name.limit}
                        isValid={name.isValid}
                        onChange={name.handleChange}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Nazwisko</FormLabel>
                    <InputWithLimit
                        required
                        name="surname"
                        type="text"
                        placeholder="Kowalski"
                        value={surname.value}
                        limit={surname.limit}
                        isValid={surname.isValid}
                        onChange={surname.handleChange}
                    />
                </FormControl>
                <FormControl error={passwordsDontMatch || passwordTooShort} sx={{
                    '--hue': Math.min(password.length * 10, 120),
                }} required>
                    <FormLabel>Hasło</FormLabel>
                    <Input
                        startDecorator={<Key/>}
                        required
                        name="password"
                        type="password"
                        placeholder="haslo"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value)
                            if (e.target.value < 8) {
                                setPasswordTooShort(true);
                                return;
                            }
                            setPasswordTooShort(false)
                            if (repeatPassword.length > 0 && repeatPassword !== e.target.value) {
                                setPasswordsDontMatch(true);
                            } else {
                                setPasswordsDontMatch(false);
                            }
                        }}
                    />
                    <LinearProgress
                        determinate
                        size="sm"
                        value={Math.min((password.length * 100) / minLength, 100)}
                        sx={{
                            bgcolor: 'background.level3',
                            color: 'hsl(var(--hue) 80% 40%)',
                        }}
                    />
                    <Typography
                        level="body-xs"
                        sx={{alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)'}}
                    >
                        {password.length < 6 && 'Bardzo słabe'}
                        {password.length >= 6 && password.length < 10 && 'Słabe'}
                        {password.length >= 10 && password.length < 15 && 'Silne'}
                        {password.length >= 15 && 'Bardzo silne'}
                    </Typography>
                    {passwordTooShort && <FormHelperText>
                        Hasło musi mieć przynajmniej 8 znaków
                    </FormHelperText>}
                </FormControl>
                <FormControl error={passwordsDontMatch} required>
                    <FormLabel>Powtórz Hasło</FormLabel>
                    <Input
                        startDecorator={<Key/>}
                        required
                        color={passwordsDontMatch ? "danger" : "neutral"}
                        name="password"
                        type="password"
                        placeholder="haslo"
                        value={repeatPassword}
                        onChange={e => {
                            setRepeatPassword(e.target.value)
                            if (password !== e.target.value) {
                                setPasswordsDontMatch(true);
                                return;
                            }
                            setPasswordsDontMatch(false)
                        }}
                    />
                    {passwordsDontMatch && <FormHelperText>
                        Hasła nie zgadzają się
                    </FormHelperText>}
                </FormControl>


                <Button sx={{mt: 1 /* margin top */}} type={"submit"} disabled={!isFormValid}>Zarejestruj się</Button>
                <Typography
                    endDecorator={<LinkWithRouter to="/login">Zaloguj się</LinkWithRouter>}
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
    )
        ;
};

export default SignUpForm;