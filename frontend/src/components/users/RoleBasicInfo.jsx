import React, {useEffect, useState} from 'react';
import {useMobileSize} from "../../utils/SizeQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";

const RoleBasicInfo = ({localRole, updateRoleInfo, updateRoleDetailsLoading}) => {

    const mobile = useMobileSize();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (localRole) {
            setName(localRole.name);
            setDescription(localRole.description)
        }
    }, [localRole]);

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 200 : 450, flex: 1, display: "flex"}} color={"primary"}
              variant={"solid"}
              invertedColors>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Informacje</Typography>
                <Typography level={"body-sm"}>Detale na temat roli</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}} onSubmit={(e) => {
                e.preventDefault()
                updateRoleInfo(name, description);
            }}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <div>

                        <Stack spacing={1}>
                            <FormLabel>
                                <Typography level={"title-sm"}>Nazwa</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Nazwa"} value={name} onChange={(e) => {
                                    setName(e.target.value)
                                }}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Opis</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder={"Opis"} value={description} onChange={(e) => {
                                    setDescription(e.target.value)
                                }}/>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button type={"submit"}>Zapisz</Button>
                </CardActions>
            </form>
        </Card>)
};

export default RoleBasicInfo;