import React, {useState} from 'react';
import {Card, CardActions, CardContent, Divider, Link, List, ListItem, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../data/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../utils/AccessRights";
import {useMobileSize} from "../../utils/SizeQuery";
import ContactPersonDialog from "./ContactPersonDialog";

const CompanyContactPeople = ({
                                  contactPeople, addContactPerson, addingContactPerson,
                                  modifyContactPerson
                              }) => {

    const [addContactPersonOpen, setAddContactPersonOpen] = useState(false);
    const [editedPerson, setEditedPerson] = useState(null);
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
                <List sx={{paddingTop: 0}}>
                    {contactPeople && contactPeople.map((person, i) => {
                        return <div key={person.id}>
                            <ListItem sx={{paddingBottom: 1}}>
                                <div style={{
                                    display: "flex", flexDirection: mobile ? "column" : "row",
                                    justifyContent: "space-between", flex: 1
                                }}>
                                    <div style={{flex: 0.6}}>
                                        <Typography>{person.name}</Typography>
                                        <Typography level={"body-sm"}>{person.position}</Typography>
                                        <Typography level={"body-sm"}>Alumn: {person.alumni ? "Tak" : "Nie"}</Typography>
                                    </div>
                                    <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                        <Typography>{person.phone}</Typography>
                                        <Typography>{person.email}</Typography>
                                        <Typography>{person.comment}</Typography>
                                    </div>
                                    <div>
                                        <Link onClick={() => {
                                            setEditedPerson(person)
                                            setAddContactPersonOpen(true)
                                        }}>Edytuj</Link>
                                    </div>
                                </div>
                            </ListItem>
                            {i !== contactPeople.length - 1 && <Divider inset={"context"}/>}
                        </div>
                    })}
                </List>
                {(!contactPeople || contactPeople.length === 0) &&
                    <div style={{display: "flex", justifyContent: "center", flex: 1, paddingBottom: 20}}>
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
                <ContactPersonDialog open={addContactPersonOpen} close={() => {
                    setEditedPerson(null)
                    setAddContactPersonOpen(false)
                }}
                                     contactPerson={editedPerson}
                                     addContactPerson={addContactPerson}
                                     addingContactPerson={addingContactPerson}
                                     modifyContactPerson={modifyContactPerson}/>
            </form>
        </Card>)
};

export default CompanyContactPeople;