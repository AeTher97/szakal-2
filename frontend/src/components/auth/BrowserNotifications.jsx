import React, {useEffect, useState} from 'react';
import {Checkbox, DialogActions, DialogTitle, Modal, ModalDialog, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useUserData} from "../../data/UsersData";
import {useSelector} from "react-redux";


const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const BrowserNotifications = () => {

    const {userId} = useSelector(state => state.auth);

    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
    const [neverShowAgain, setNeverShowAgain] = useState(false);

    const {addPushToken} = useUserData(userId);

    useEffect(() => {
        const notificationPermissions = Notification.permission;

        if (!("Notification" in window)) {
            return;
        }
        if (notificationPermissions === "default" && !localStorage.getItem("declinedNotifications")) {
            setShowNotificationPrompt(true)
        }
    }, []);

    const subscribeUserToPush = () => {
        navigator.serviceWorker
            .register("/notification-worker.js")
            .then(async registration => {
                await navigator.serviceWorker.ready

                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(import.meta.env.VITE_PUSH_PUBLIC_KEY)
                }

                return registration.pushManager.subscribe(subscribeOptions);
            }).then(pushSubscription => {
            addPushToken(pushSubscription);
        });
    }

    const requestNotificationPermissions = () => {
        return new Promise(resolve => {
            Notification.requestPermission().then(result => {
                resolve(result)
            })
        }).then(permissionResult => {
            if (permissionResult !== "granted") {
                console.log("Notifications denied, too bad")
            }
            return subscribeUserToPush();
        });
    }


    return (
        <div>
            <Modal open={showNotificationPrompt}>
                <ModalDialog>
                    <DialogTitle>
                        <Typography>
                            Czy chciałbyś otrzymywać powiadomienia z Szakala?
                        </Typography>
                    </DialogTitle>
                    <DialogTitle>
                        <Typography variant={"body"}>
                            (Zmiany w Twoich kontaktach)
                        </Typography>
                    </DialogTitle>
                    <DialogActions>
                        <Checkbox label={"Nie pytaj ponownie"} onChange={(e) => {
                            setNeverShowAgain(e.target.value);
                        }}/>
                    </DialogActions>
                    <DialogActions>
                        <Button color={"danger"} onClick={() => {
                            console.log(neverShowAgain)
                            if (neverShowAgain) {
                                localStorage.setItem("declinedNotifications", "true")
                            }
                            setShowNotificationPrompt(false);
                        }}>Nie
                        </Button>
                        <Button onClick={() => {
                            requestNotificationPermissions()
                                .then(() => {
                                    setShowNotificationPrompt(false);
                                });
                        }}>Tak</Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </div>
    );
};

export default BrowserNotifications;