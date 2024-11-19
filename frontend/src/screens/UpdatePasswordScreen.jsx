import React, {useState} from 'react';
import {Card, FormControl, FormHelperText, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {showSuccess} from "../redux/AlertActions";
import {useDispatch} from "react-redux";
import {usePasswordReset} from "../data/AuthenticationData";

const UpdatePasswordScreen = () => {

    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);
    const [search, setSearch] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {updatePassword} = usePasswordReset();


    return (
        <div style={{display: "flex", justifyContent: "center", padding: 20}}>
            <Card style={{flex: 1, maxWidth: 400}}>
                <Typography>Utwórz nowe hasło</Typography>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordTooShort || passwordsDontMatch) {
                        return
                    }
                    updatePassword(password, repeatPassword, search.get("code")).then((e) => {
                            navigate("/login");
                            dispatch(showSuccess("Hasło zostało zmienione"));
                    }).catch(e => {})
                }}>
                    <Stack spacing={1}>
                        <FormControl error={passwordTooShort}>
                            <Input type={"password"} placeholder={"Haslo"}
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                       if (e.target.value < 8) {
                                           setPasswordTooShort(true);
                                           return;
                                       }
                                       setPasswordTooShort(false)
                                   }}
                                   value={password}/>
                            {passwordTooShort && <FormHelperText>
                                Hasło musi mieć przynajmniej 8 znaków
                            </FormHelperText>}
                        </FormControl>
                        <FormControl error={passwordsDontMatch}>
                            <Input type={"password"} placeholder={"Powtórz hasło"}
                                   onChange={(e) => {
                                       setRepeatPassword(e.target.value)
                                       if (password !== e.target.value) {
                                           setPasswordsDontMatch(true);
                                           return;
                                       }
                                       setPasswordsDontMatch(false)
                                   }}
                                   value={repeatPassword}/>
                            {passwordsDontMatch && <FormHelperText>
                                Hasła nie zgadzają się
                            </FormHelperText>}
                        </FormControl>
                        <Button type={"submit"} style={{flex: 1}}>
                            Zmień hasło
                        </Button>
                    </Stack>
                </form>
            </Card>
        </div>
    )
        ;
};

export default UpdatePasswordScreen;