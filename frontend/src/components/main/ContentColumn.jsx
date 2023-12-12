import React, {useState} from 'react';
import {useFullColumnSize, useMobileSize} from "../../utils/SizeQuery";
import ScheduledContacts from "../notifications/ScheduledContacts";
import {IconButton, Modal, ModalDialog} from "@mui/joy";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from "@mui/joy/Button";

const ContentColumn = props => {

    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const mediumSize = useFullColumnSize();
    const small = useMobileSize();

    return (
        <div style={{
            width: "100%", height: "100%",
            display: "flex", justifyContent: "center", alignItems: "stretch", overflow: "auto",
            gap: 10
        }}>
            <div style={{
                maxWidth: 1200, flex: 1, overflow: "auto", display: "flex", flexDirection: "column",
                padding: 10, paddingBottom: 0, marginLeft: small ? 0 : 10
            }}>
                {props.children}
            </div>
            {!mediumSize ?
                <div
                    style={{
                        marginRight: 10,
                        marginBottom: 10,
                        flex: 1,
                        maxWidth: 300,
                        paddingTop: 54
                    }}>
                    <ScheduledContacts/>
                </div> :
                <>
                    <IconButton style={{position: "absolute", bottom: 50, right: 50, padding: 10,
                    boxShadow: "2px 2px 3px 1px black", zIndex: 1299}}
                                variant={"solid"} color={"primary"} size={"lg"} onClick={ () => {
                                    setNotificationDrawerOpen(true)
                    }}>
                        <NotificationsIcon/>
                    </IconButton>
                    <Modal open={notificationDrawerOpen}>
                        <ModalDialog sx={{padding: 0, border:"none", backgroundColor: "transparent"}}>
                            <ScheduledContacts/>
                            <Button color={"neutral"} onClick ={() => {
                                setNotificationDrawerOpen(false)}}>
                                Zamknij
                            </Button>
                        </ModalDialog>
                    </Modal>
                </>}
        </div>
    );
};

export default ContentColumn;