import React, {useEffect, useState} from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";

const CompanyAddress = ({localCompany, updateAddress, updateAddressLoading}) => {
    const mobile = useMobileSize();


    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION);

    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [postalCode, setPostalCode] = useState("");

    useEffect(() => {
        if (localCompany) {
            setCity(localCompany.address.city)
            setStreet(localCompany.address.street)
            setPostalCode(localCompany.address.postalCode)
        }
    }, [localCompany])

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 300 : 450, flex: 1, display: "flex"}} color={"primary"}>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Adres</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}} onSubmit={(e) => {
                e.preventDefault()
                updateAddress(city, street, postalCode)
            }}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <Stack spacing={1} sx={{flex: mobile ? 1 : 0}}>
                        <FormLabel>
                            <Typography level={"title-sm"}>Miasto</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input disabled={!canModify} placeholder={"Miasto"} value={city} onChange={(e) => {
                                setCity(e.target.value)
                            }}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Ulica</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input disabled={!canModify} placeholder={"Ulica"} value={street} onChange={(e) => {
                                setStreet(e.target.value)
                            }}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Kod pocztowy</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input disabled={!canModify} placeholder={"Kod pocztowy"} value={postalCode}
                                   onChange={(e) => {
                                setPostalCode(e.target.value)
                            }}/>
                        </FormControl>
                    </Stack>

                </CardContent>
                {canModify && <CardActions>
                    <Button loading={updateAddressLoading} type={"submit"}>Zapisz</Button>
                </CardActions>}
            </form>
        </Card>
    )
};

export default CompanyAddress;