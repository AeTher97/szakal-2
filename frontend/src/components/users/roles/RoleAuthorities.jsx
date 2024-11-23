import React from 'react';
import {Card, CardActions, CardContent, Chip, ChipDelete, Divider, Typography} from "@mui/joy";
import {uuidToColor} from "../../../utils/ColorForUUID";
import {useMobileSize} from "../../../utils/MediaQuery";
import {useAccessRightsList} from "../../../data/UseAccessRightsList";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {ROLE_MODIFICATION} from "../../../utils/AccessRightsList";
import PropTypes from "prop-types";

const RoleAuthorities = ({role, localRole, setLocalRole, updateRole, updateRoleLoading}) => {

    const {accessRights} = useAccessRightsList();
    const {hasRight} = useAccessRightsHelper();
    const mobile = useMobileSize();

    const removeAccessRight = (id) => {
        setLocalRole(old => {
            return {
                ...old,
                accessRights: old.accessRights.filter(
                    innerAccessRight => innerAccessRight.id !== id)
            }
        });
    }

    const getCurrentRights = () => {
        return localRole.accessRights
            .map(accessRight => <Chip key={accessRight.id}
                                      sx={{backgroundColor: uuidToColor(accessRight.id, 0.5)}}
                                      endDecorator={hasRight(ROLE_MODIFICATION) ?
                                          <ChipDelete onDelete={() => removeAccessRight(accessRight.id)}/> : <></>}>
                {accessRight.description}
            </Chip>)
    }
    return (
        <Card sx={{maxWidth: 640, flex: 1, minWidth: mobile ? 200 : 400}}>
            <CardContent>
                <Typography level={"title-md"}>Uprawnienia</Typography>
                <Typography level={"body-sm"}>Uprawnianie które posiada rola</Typography>
            </CardContent>
            <Divider/>
            <CardContent orientation={"horizontal"} style={{flex: 0, display: "flex", flexWrap: "wrap"}}>
                {getCurrentRights()}
                {localRole.accessRights.length === 0 && <Typography>Brak uprawnień</Typography>}
            </CardContent>
            <Divider/>
            <CardContent>
                <Typography level={"title-md"}>Dostępne uprawnienia</Typography>
                <Typography level={"body-sm"}>Wybierz uprawnienia dla roli</Typography>
            </CardContent>
            <Divider/>
            <CardContent orientation={"horizontal"} sx={{display: "flex", flexWrap: "wrap"}}>
                {accessRights?.filter(accessRight => {
                    return !localRole.accessRights.find(roleAccessRight => roleAccessRight.id === accessRight.id);
                }).map(accessRight => <Chip sx={{backgroundColor: uuidToColor(role.id, 0.5)}}
                                            key={accessRight.id}
                                            onClick={() => {
                                                if (!hasRight(ROLE_MODIFICATION)) {
                                                    return;
                                                }
                                                setLocalRole(old => {
                                                    return {
                                                        ...old,
                                                        accessRights: [...old.accessRights, accessRight]
                                                    }
                                                })
                                            }}
                                            variant={"soft"}>
                    {accessRight.description}
                </Chip>)}
            </CardContent>
            <CardActions>
                <Button loading={updateRoleLoading}
                        onClick={() => updateRole(localRole.accessRights.map(localAccessRight => localAccessRight.id))}>Zapisz
                </Button>
            </CardActions>
        </Card>
    )
        ;
};

RoleAuthorities.propTypes = {
    role: PropTypes.object.isRequired,
    localRole: PropTypes.object.isRequired,
    setLocalRole: PropTypes.func.isRequired,
    updateRole: PropTypes.func.isRequired,
    updateRoleLoading: PropTypes.bool
}

export default RoleAuthorities;