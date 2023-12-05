import React, {useState} from 'react';
import {Card, CardActions, CardContent, Divider, List, ListItem, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import {useMobileSize} from "../../utils/SizeQuery";
import AddContactPersonDialog from "./AddContactPersonDialog";

const CompanyContactPeople = ({
                                  contactPeople, setContactPeople, updateContactPeople,
                                  updatePeopleLoading, addContactPerson, addingContactPerson
                              }) => {

    const [addContactPersonOpen, setAddContactPersonOpen] = useState(false);
    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION);
    const mobile = useMobileSize();

    return (
        <Card sx={{minWidth: mobile ? 300 : 450, flex: 1, display: "flex"}} color={"neutral"}>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Osoby kontaktowe</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}} onSubmit={(e) => {
                e.preventDefault()
            }}>
                <List>
                    {contactPeople && contactPeople.map((person, i) => {
                        return <>
                            <ListItem>
                                <div style={{display: "flex", justifyContent: "space-between", flex: 1}}>
                                    <div>
                                        <Typography>{person.name}</Typography>
                                        <Typography level={"body-sm"}>{person.position}</Typography>
                                    </div>
                                    <div>
                                        <Typography>{person.phone}</Typography>
                                        <Typography>{person.email}</Typography>
                                    </div>
                                </div>
                            </ListItem>
                            {i !== contactPeople.length - 1 && <Divider inset={"context"}/>}
                        </>
                    })}
                </List>
                {(!contactPeople || contactPeople.length === 0) &&
                    <div style={{display: "flex", justifyContent: "center", flex: 1}}>
                        <Typography>
                            Brak osób kontaktowych
                        </Typography>
                    </div>}

                <Divider inset={"context"}/>
                {canModify && <CardActions buttonFlex={"1"}>
                    <Button variant={"outlined"} color={"neutral"} onClick={() => {
                        setAddContactPersonOpen(true);
                    }}>Dodaj</Button>
                </CardActions>}
                <AddContactPersonDialog open={addContactPersonOpen} close={() => {
                    setAddContactPersonOpen(false)
                }}
                                        addContactPerson={addContactPerson}
                                        addingContactPerson={addingContactPerson}/>
            </form>
        </Card>)
};

export default CompanyContactPeople;