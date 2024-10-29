import React, {useEffect, useState} from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import InputWithLimit from "../../utils/InputWithLimit";

const CompanyContactData = ({localCompany, updateContactData, updateContactDataLoading}) => {

    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION) && !localCompany.deleted;

    const mobile = useMobileSize();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [www, setWWW] = useState("")

    useEffect(() => {
        setName(localCompany.name)
        setEmail(localCompany.email)
        setPhone(localCompany.phone)
        setWWW(localCompany.www)
    }, [localCompany]);

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
                    <Stack spacing={1} sx={{flex: mobile ? 1 : 0}}>
                            <FormLabel>
                                <Typography level={"title-sm"}>Nazwa</Typography>
                            </FormLabel>
                        <InputWithLimit disabled={!canModify} placeholder={"Nazwa"} value={name} onChange={(e) => {
                                    setName(e.target.value)
                                }}/>
                            <FormLabel>
                                <Typography level={"title-sm"}>Email</Typography>
                            </FormLabel>
                        <InputWithLimit disabled={!canModify} placeholder={"Email"} value={email} onChange={(e) => {
                                    setEmail(e.target.value)
                                }}/>
                            <FormLabel>
                                <Typography level={"title-sm"}>Telefon</Typography>
                            </FormLabel>
                        <InputWithLimit disabled={!canModify} placeholder={"Telefon"} value={phone} onChange={(e) => {
                                    setPhone(e.target.value)
                                }}/>
                                <FormLabel>
                                    <Typography level={"title-sm"}>Strona</Typography>
                                </FormLabel>
                        <InputWithLimit disabled={!canModify} placeholder={"WWW"} value={www} onChange={(e) => {
                                    setWWW(e.target.value)
                                }}/>
                        </Stack>

                </CardContent>
                <CardActions>
                    {canModify && <Button loading={updateContactDataLoading} type="submit" onClick={() => {
                        updateContactData(name, email, phone, www)
                    }}>Zapisz</Button>}
                </CardActions>
            </form>
        </Card>
    )
};

export default CompanyContactData;