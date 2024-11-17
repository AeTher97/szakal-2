import React, {useState} from 'react';
import {Card, Divider, IconButton, Typography} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import {useScheduledContactList} from "../../data/NotificationData";
import {formatLocalDateTime} from "../../utils/DateUtils";
import ScheduledContactDialog from "./ScheduledContactDialog";

import DeleteIcon from '@mui/icons-material/Delete';
import {useConfirmationDialog} from "../../utils/ConfirmationDialog";


const ScheduledContact = () => {

    const {scheduledContacts, removeScheduledContact,reloadData} = useScheduledContactList();
    const {openDialog, render} = useConfirmationDialog("Usunać kontakt?")
    const [open, setOpen] = useState(false);

    return (
        <Card style={{overflow: "auto", minHeight: 300, maxHeight: 350}}
              variant={"outlined"} color={"primary"}>
            <div style={{display: "flex", justifyContent: "space-between", justifyItems: "center"}}>
                <Typography level={"h4"}>Zaplanowane kontakty</Typography>
                <IconButton>
                    <AddIcon onClick={() => setOpen(true)}/>
                </IconButton>
            </div>
            <Divider/>
            {scheduledContacts.map((contact, i) => <div key={contact.id}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div style={{paddingBottom: 10, paddingTop: i === 0 ? 0 : 10}}>
                        <Typography level={"title-md"}>{contact.company.name}</Typography>
                        <Typography level={"body"}>{contact.note}</Typography>
                        <Typography level={"body-sm"}>kontakt: {formatLocalDateTime(contact.contactDate)}</Typography>
                        <Typography
                            level={"body-sm"}>przypomnienie: {formatLocalDateTime(contact.reminderDate)}</Typography>
                    </div>
                    <IconButton onClick={() =>{
                        openDialog(() => {
                            removeScheduledContact(contact.id)
                        })
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
                {i !== scheduledContacts.length - 1 && <Divider inset={"context"}/>}
            </div>)}
            <ScheduledContactDialog open={open} close={() => {
                setOpen(false)
                reloadData();
            }}/>
            {render()}
        </Card>
    );
};

export default ScheduledContact;