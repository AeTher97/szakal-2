import React, {useState} from 'react';
import {
    DialogTitle,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    LinearProgress,
    Modal,
    ModalDialog,
    Stack,
    Typography
} from "@mui/joy";
import Button from "@mui/joy/Button";
import {usePasswordChange} from "../../data/UsersData";

const PasswordChangeDialog = ({open, close, userId}) => {

    const {changePassword, changePasswordLoading} = usePasswordChange(userId);

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const minLength = 8;

    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);

    const changePasswordInner = (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setPasswordTooShort(true);
            return;
        }
        setPasswordTooShort(false)
        if (password !== repeatPassword) {
            setPasswordsDontMatch(true);
            return;
        }
        setPasswordsDontMatch(false)

        changePassword(oldPassword, password, repeatPassword)
            .then(() => {
                close();
            })
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Zmień hasło</DialogTitle>
                <form onSubmit={changePasswordInner}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Obecne hasło</FormLabel>
                            <Input autoFocus
                                   value={oldPassword}
                                   type={"password"}
                                   onChange={(e) => {
                                       setOldPassword(e.target.value)
                                   }} placeholder={"Obecne hasło"}/>
                        </FormControl>
                        <FormControl error={passwordsDontMatch || passwordTooShort} sx={{
                            '--hue': Math.min(password.length * 10, 120),
                        }}>
                            <FormLabel>Nowe hasło</FormLabel>
                            <Input autoFocus
                                   value={password}
                                   type={"password"}
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                   }} placeholder={"Nowe hasło"}/>
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
                                {password.length < 3 && 'Bardzo słabe'}
                                {password.length >= 3 && password.length < 6 && 'Słabe'}
                                {password.length >= 6 && password.length < 10 && 'Silne'}
                                {password.length >= 10 && 'Bardzo silne'}
                            </Typography>
                            {passwordTooShort && <FormHelperText>
                                Hasło musi mieć przynajmniej 8 znaków
                            </FormHelperText>}
                        </FormControl>

                        <FormControl error={passwordsDontMatch}>
                            <FormLabel>Powtórz nowe hasło</FormLabel>
                            <Input
                                type={"password"}
                                value={repeatPassword}
                                onChange={(e) => {
                                    setRepeatPassword(e.target.value)
                                }} placeholder={"Powtórz nowe hasło"}/>
                            {passwordsDontMatch && <FormHelperText>
                                Hasła nie zgadzają się
                            </FormHelperText>}
                        </FormControl>
                        <Button loading={changePasswordLoading} type="submit">Zmień hasło</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </Stack>
                </form>

            </ModalDialog>
        </Modal>
    );
};

export default PasswordChangeDialog;