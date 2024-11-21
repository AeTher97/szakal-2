import React, {useState} from 'react';
import {Card, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import InputWithLimit from "../components/misc/InputWithLimit";
import {usePasswordReset} from "../data/AuthenticationData";

const PasswordResetScreen = () => {

    const [email, setEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const {resetPassword} = usePasswordReset();

    return (
        <div style={{display: "flex", justifyContent: "center", padding: 20}}>
            <Card style={{flex: 1, maxWidth: 400}}>
                {!resetSent && <>
                    <Typography>Resetuj hasło</Typography>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        resetPassword(email).then(() => {
                            setResetSent(true)
                        });
                    }}>
                        <Stack spacing={1}>
                            <InputWithLimit type={"email"} placeholder={"Email"}
                                   onChange={(e) => setEmail(e.target.value)}
                                   value={email}/>
                            <Button type={"submit"} style={{flex: 1}}>
                                Reset
                            </Button>
                        </Stack>
                    </form>
                </>}
                {resetSent &&
                    <Typography>
                        Na Twoją skrzynkę mailową powinna dotrzeć wiadomość o resetowaniu hasła
                    </Typography>}
            </Card>
        </div>
    )
        ;
};

export default PasswordResetScreen;