import React, {useState} from 'react';
import {Card, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {usePasswordReset} from "../data/AuthenticationData";
import {InputWithLimit} from "../components/misc/InputWithLimit";
import {UseFieldValidation} from "../utils/UseFieldValidation";

const PasswordResetScreen = () => {

    const email = UseFieldValidation();
    const [resetSent, setResetSent] = useState(false);
    const {resetPassword} = usePasswordReset();

    const isFormValid = email.isValid;

    return (
        <div style={{display: "flex", justifyContent: "center", padding: 20}}>
            <Card style={{flex: 1, maxWidth: 400}}>
                {!resetSent && <>
                    <Typography>Resetuj hasło</Typography>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        resetPassword(email.value).then(() => {
                            setResetSent(true)
                        });
                    }}>
                        <Stack spacing={1}>
                            <InputWithLimit type={"email"} placeholder={"Email"}
                                            value={email.value}
                                            limit={email.limit}
                                            isValid={email.isValid}
                                            onChange={email.handleChange}/>
                            <Button type={"submit"} style={{flex: 1}} disabled={!isFormValid}>
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