import React from 'react';
import {Card, CardActions, CardContent, Chip, ChipDelete, Divider, Typography} from "@mui/joy";
import {uuidToColor} from "../../utils/ColorForUUID";
import {useMobileSize} from "../../utils/SizeQuery";
import {useAccessRightsList} from "../../data/UseAccessRightsList";
import Button from "@mui/joy/Button";

const RoleAuthorities = ({role, localRole, setLocalRole, updateRole}) => {

    const {accessRights, loading} = useAccessRightsList();
    const mobile = useMobileSize();

    return (
        <Card sx={{maxWidth: 640, flex: 1, minWidth: mobile ? 200 : 400}}>
            <CardContent>
                <Typography level={"title-md"}>Uprawnienia</Typography>
                <Typography level={"body-sm"}>Uprawnianie które posiada rola</Typography>
            </CardContent>
            <Divider/>
            <CardContent orientation={"horizontal"} style={{flex: 0, display: "flex", flexWrap: "wrap"}}>
                {localRole.accessRights.map(accessRight => <Chip key={accessRight.id}
                                                                 sx={{backgroundColor: uuidToColor(accessRight.id)}}
                                                                 endDecorator={<ChipDelete onDelete={() => {
                                                                     setLocalRole(old => {
                                                                         return {
                                                                             ...old,
                                                                             accessRights: old.accessRights.filter(
                                                                                 innerAccessRight => innerAccessRight.id !== accessRight.id)
                                                                         }
                                                                     })
                                                                 }}/>}>
                    {accessRight.description}
                </Chip>)}
                {localRole.accessRights.length === 0 && <Typography>Brak uprawnień</Typography>}
            </CardContent>
            <Divider/>
            <CardContent>
                <Typography level={"title-md"}>Dostępne uprawnienia</Typography>
                <Typography level={"body-sm"}>Wybierz uprawnienia dla roli</Typography>
            </CardContent>
            <Divider/>
            <CardContent orientation={"horizontal"} sx={{display: "flex", flexWrap: "wrap"}}>
                {accessRights && accessRights.filter(accessRight => {
                    return !localRole.accessRights.find(roleAccessRight => roleAccessRight.id === accessRight.id);
                }).map(accessRight => <Chip sx={{backgroundColor: uuidToColor(role.id)}}
                                            key={accessRight.id}
                                            onClick={() => {
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
                <Button
                    onClick={() => updateRole(localRole.accessRights.map(localAccessRight => localAccessRight.id))}>Zapisz
                </Button>
            </CardActions>
        </Card>
    )
        ;
};

export default RoleAuthorities;