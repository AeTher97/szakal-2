import React, {useEffect, useState} from 'react';
import {useMobileSize} from "../../../utils/MediaQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {ROLE_MODIFICATION} from "../../../utils/AccessRightsList";
import PropTypes from "prop-types";

const RoleBasicInfo = ({localRole, updateRoleInfo}) => {

    const mobile = useMobileSize();

    const {hasRight} = useAccessRightsHelper();
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
                                <Input disabled={!hasRight(ROLE_MODIFICATION)} placeholder={"Nazwa"} value={name}
                                       onChange={(e) => {
                                    setName(e.target.value)
                                }}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Opis</Typography>
                            </FormLabel>
                            <FormControl>
                                <Input disabled={!hasRight(ROLE_MODIFICATION)} placeholder={"Opis"} value={description}
                                       onChange={(e) => {
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

RoleBasicInfo.propTypes = {
    localRole: PropTypes.object.isRequired,
    updateRoleInfo: PropTypes.func.isRequired
}

export default RoleBasicInfo;