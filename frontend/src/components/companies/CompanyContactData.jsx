import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";

const CompanyContactData = ({localCompany}) => {

    const mobile = useMobileSize();

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
                    <div>
                        <Stack spacing={1}>
                            <FormLabel>
                                <Typography level={"title-sm"}>Nazwa</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Nazwa"} value={localCompany.email}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Email</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Email"} value={localCompany.email}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Telefon</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Telefon"} value={localCompany.phone}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>
                                    <Typography level={"title-sm"}>Strona</Typography>
                                </FormLabel>
                                <Input placeholder={"WWW"} value={localCompany.www}/>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button>Zapisz</Button>
                </CardActions>
            </form>
        </Card>
    )
};

export default CompanyContactData;