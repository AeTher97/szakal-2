import React from 'react';
import {useMobileSize} from "../../../utils/MediaQuery";
import {Card, CardActions, CardContent, Divider, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../../utils/AccessRightsList";
import PropTypes from "prop-types";
import {InputWithLimit} from "../../misc/InputWithLimit";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";
import {UseFormValidation} from "../../../utils/UseFormValidation";

const CompanyContactData = ({localCompany, updateContactData, updateContactDataLoading}) => {

    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION) && !localCompany.deleted;

    const mobile = useMobileSize();
    const name = UseFieldValidation(localCompany.name);
    const email = UseFieldValidation(localCompany.email);
    const phone = UseFieldValidation(localCompany.phone);
    const www = UseFieldValidation(localCompany.www);

    const isFormValid = UseFormValidation([name, email, phone, www]);

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 200 : 350, flex: 1, display: "flex"}} color={"primary"}
              variant={"soft"}
              invertedColors>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Informacje kontaktowe</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <Stack spacing={1} sx={{flex: 1}}>
                        <FormLabel>
                            <Typography level={"title-sm"}>Nazwa</Typography>
                        </FormLabel>
                        <InputWithLimit
                            disabled={!canModify}
                            placeholder={"Nazwa"}
                            value={name.value}
                            limit={name.limit}
                            isValid={name.isValid}
                            onChange={name.handleChange}/>
                        <FormLabel>
                            <Typography level={"title-sm"}>Email</Typography>
                        </FormLabel>
                        <InputWithLimit
                            disabled={!canModify}
                            placeholder={"Email"}
                            value={email.value}
                            limit={email.limit}
                            isValid={email.isValid}
                            onChange={email.handleChange}/>
                        <FormLabel>
                            <Typography level={"title-sm"}>Telefon</Typography>
                        </FormLabel>
                        <InputWithLimit
                            disabled={!canModify}
                            placeholder={"Telefon"}
                            value={phone.value}
                            limit={phone.limit}
                            isValid={phone.isValid}
                            onChange={phone.handleChange}/>
                        <FormLabel>
                            <Typography level={"title-sm"}>Strona</Typography>
                        </FormLabel>
                        <InputWithLimit
                            disabled={!canModify}
                            placeholder={"WWW"}
                            value={www.value}
                            limit={www.limit}
                            isValid={www.isValid}
                            onChange={www.handleChange}/>
                    </Stack>

                </CardContent>
                <CardActions>
                    {canModify && <Button loading={updateContactDataLoading} type="submit" onClick={() => {
                        updateContactData(name.value, email.value, phone.value, www.value)
                    }} disabled={!isFormValid}>Zapisz</Button>}
                </CardActions>
            </form>
        </Card>
    )
};

CompanyContactData.propTypes = {
    localCompany: PropTypes.object.isRequired,
    updateContactData: PropTypes.func.isRequired,
    updateContactDataLoading: PropTypes.bool.isRequired
}

export default CompanyContactData;