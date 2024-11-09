import React, {useState} from 'react';
import {useMediumSize, useMobileSize} from "../../utils/SizeQuery";
import ScheduledContacts from "../notifications/ScheduledContacts";
import {IconButton, Modal, ModalDialog} from "@mui/joy";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from "@mui/joy/Button";
import Footer from "../Footer";
import FavouriteJourneys from "./FavouriteJourneys";

const ContentColumn = props => {

    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const mediumSize = useMediumSize();
    const small = useMobileSize();

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <div style={{
                display: "flex", justifyContent: "center", alignItems: "stretch",
                gap: 10
            }}>
                <div style={{
                    maxWidth: 1200, flex: 1, display: "flex", flexDirection: "column",
                    paddingBottom: 0, marginLeft: small ? 0 : 10, marginRight: small ? 0 : 10
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
                            paddingTop: 54,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10
                        }}>
                        <ScheduledContacts/>
                        <FavouriteJourneys/>
                    </div> :
                    <>
                        <IconButton style={{
                            position: "fixed", bottom: 40, right: 40, padding: 10,
                            boxShadow: "0px 3px 5px -1px rgba(0, 0, 0, 0.2)," +
                                " 0px 6px 10px 0px rgba(0, 0, 0, 0.14), " +
                                "0px 1px 18px 0px rgba(0, 0, 0, 0.12)", zIndex: 1299
                        }}
                                    variant={"solid"} color={"primary"} size={"lg"} onClick={() => {
                            setNotificationDrawerOpen(true)
                        }}>
                            <NotificationsIcon/>
                        </IconButton>
                        <Modal open={notificationDrawerOpen}>
                            <ModalDialog sx={{padding: 0, border: "none", backgroundColor: "transparent"}}>
                                <ScheduledContacts/>
                                <Button color={"neutral"} onClick={() => {
                                    setNotificationDrawerOpen(false)
                                }}>
                                    Zamknij
                                </Button>
                            </ModalDialog>
                        </Modal>
                    </>}
            </div>
            <Footer/>
        </div>
    );
};

export default ContentColumn;