import React, {useEffect} from 'react';
import {useMobileSize} from "../../../utils/MediaQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {ROLE_MODIFICATION} from "../../../utils/AccessRightsList";
import PropTypes from "prop-types";
import {InputWithLimit} from "../../misc/InputWithLimit";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";
import {UseFormValidation} from "../../../utils/UseFormValidation";

const RoleBasicInfo = ({localRole, updateRoleInfo}) => {

    const mobile = useMobileSize();

    const {hasRight} = useAccessRightsHelper();
    const name = UseFieldValidation("", 6);
    const description = UseFieldValidation();

    const isFormValid = UseFormValidation([name, description]);

    useEffect(() => {
        if (localRole) {
            name.setValue(localRole.name);
            description.setValue(localRole.description);
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
                updateRoleInfo(name.value, description.value);
            }}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <div>

                        <Stack spacing={1}>
                            <FormLabel>
                                <Typography level={"title-sm"}>Nazwa</Typography>
                            </FormLabel>
                            <FormControl>
                                <InputWithLimit disabled={!hasRight(ROLE_MODIFICATION)}
                                                placeholder={"Nazwa"}
                                                value={name.value}
                                                limit={name.limit}
                                                isValid={name.isValid}
                                                onChange={name.handleChange}/>
                            </FormControl>
                            <FormLabel>
                                <Typography level={"title-sm"}>Opis</Typography>
                            </FormLabel>
                            <FormControl>
                                <InputWithLimit disabled={!hasRight(ROLE_MODIFICATION)}
                                                placeholder={"Opis"}
                                                value={description.value}
                                                limit={description.limit}
                                                isValid={description.isValid}
                                                onChange={description.handleChange}/>
                            </FormControl>
                        </Stack>
                    </div>

                </CardContent>
                <CardActions>
                    <Button type={"submit"} disabled={!isFormValid}>Zapisz</Button>
                </CardActions>
            </form>
        </Card>)
};

RoleBasicInfo.propTypes = {
    localRole: PropTypes.object.isRequired,
    updateRoleInfo: PropTypes.func.isRequired
}

export default RoleBasicInfo;