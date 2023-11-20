import React from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";

const RoleBasicInfo = ({role, localRole}) => {

    const mobile = useMobileSize();

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 200 : 450, flex: 1, display: "flex"}} color={"primary"}
              variant={"solid"}
              invertedColors>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Informacje</Typography>
                <Typography level={"body-sm"}>Detale na temat roli</Typography>
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
                                <Input placeholder={"Imię"} value={localRole.name}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Opis</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Nazwisko"} value={localRole.description}/>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button>Zapisz</Button>
                </CardActions>
            </form>
        </Card>)
};

export default RoleBasicInfo;