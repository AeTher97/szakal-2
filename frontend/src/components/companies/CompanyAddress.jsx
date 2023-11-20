import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";

const CompanyAddress = ({localCompany}) => {
    const mobile = useMobileSize();

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 300 : 450, flex: 1, display: "flex"}} color={"primary"}>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Adres</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <Stack spacing={1}>
                        <FormLabel>
                            <Typography level={"title-sm"}>Miasto</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder={"Miasto"} value={localCompany.address.city}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Ulica</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder={"Email"} value={localCompany.address.street}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Kod pocztowy</Typography>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder={"Kod pocztowy"} value={localCompany.address.postalCode}/>
                        </FormControl>
                    </Stack>

                </CardContent>
                <CardActions>
                    <Button>Zapisz</Button>
                </CardActions>
            </form>
        </Card>
    )
};

export default CompanyAddress;