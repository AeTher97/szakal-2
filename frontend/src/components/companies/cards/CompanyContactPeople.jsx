import React, {useState} from 'react';
import {Card, CardActions, CardContent, Divider, Link, List, ListItem, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../../utils/AccessRightsList";
import {useMobileSize} from "../../../utils/MediaQuery";
import ContactPersonDialog from "../ContactPersonDialog";
import PropTypes from "prop-types";
import {useConfirmationDialog} from "../../misc/ConfirmationDialog";

const CompanyContactPeople = ({
                                  contactPeople,
                                  addContactPerson,
                                  addingContactPerson,
                                  modifyContactPerson,
                                  deleteContactPerson,
                                  deleted
                              }) => {

    const [addContactPersonOpen, setAddContactPersonOpen] = useState(false);
    const [editedPerson, setEditedPerson] = useState(null);
    const [deletedPerson, setDeletedPerson] = useState(null);
    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION) && !deleted;
    const mobile = useMobileSize();
    const {
        openDialog,
        render
    } = useConfirmationDialog(`Czy na pewno chcesz usunąć osobę kontaktową ${deletedPerson ? deletedPerson.name : ""}?`);

    const handleDelete = (person) => {
        openDialog(() => {
            deleteContactPerson(person).then(() => {
                setDeletedPerson(null)
            });
        });
    };

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
                    {contactPeople?.map((person, i) => {
                        return <div key={person.id}>
                            <ListItem sx={{paddingBottom: 1}} data-testid="contact-person-list">
                                <div style={{
                                    display: "flex", flexDirection: mobile ? "column" : "row",
                                    justifyContent: "space-between", flex: 1
                                }}>
                                    <div style={{flex: 0.6}}>
                                        <Typography>{person.name}</Typography>
                                        <Typography level={"body-sm"}>{person.position}</Typography>
                                        <Typography
                                            level={"body-sm"}>Alumn: {person.alumni ? "Tak" : "Nie"}</Typography>
                                        {person.committee &&
                                            <Typography level={"body-sm"}>Komitet: {person.committee}</Typography>}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start"
                                    }}>
                                        <Typography>{person.phone}</Typography>
                                        <Typography>{person.email}</Typography>
                                        <Typography>{person.comment}</Typography>
                                    </div>
                                    {canModify && <div style={{display: "flex", flexDirection: "column"}}>
                                        <Link onClick={() => {
                                            setEditedPerson(person)
                                            setAddContactPersonOpen(true)
                                        }} data-testid="edit-contact-person-button">Edytuj</Link>
                                        <Link onClick={() => {
                                            setDeletedPerson(person)
                                            handleDelete(person)
                                        }} style={{color: 'red', marginTop: "1rem"}}
                                              data-testid="delete-contact-person-button">Usuń</Link>
                                    </div>}
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

                {canModify && <Divider inset={"context"}/>}
                {canModify && <CardActions buttonFlex={"1"}>
                    <Button variant={"outlined"} color={"neutral"} onClick={() => {
                        setAddContactPersonOpen(true);
                    }} data-testid="add-contact-person-button">Dodaj</Button>
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
            {render()}
        </Card>)
};

CompanyContactPeople.propTypes = {
    contactPeople: PropTypes.array.isRequired,
    addContactPerson: PropTypes.func.isRequired,
    addingContactPerson: PropTypes.bool.isRequired,
    modifyContactPerson: PropTypes.func.isRequired,
    deleteContactPerson: PropTypes.func.isRequired,
    deleted: PropTypes.bool.isRequired
}

export default CompanyContactPeople;