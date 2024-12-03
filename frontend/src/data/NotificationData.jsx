import {useData, useDelete, usePost, usePut} from "./UseData";
import {useEffect, useState} from "react";

export const useScheduledContactList = () => {
    const [reload, setReload] = useState(1);
    const [scheduledContacts, setScheduledContacts] = useState([])
    const {loading} = useData("/scheduled-contact", (data) => {
        setScheduledContacts(data);
    }, [reload])

    const {deleteReq} = useDelete("/scheduled-contact")

    const reloadData = () => {
        setReload(reload + 1)
    }

    const removeFromArray = (id) => {
        setScheduledContacts(state => {
            return [...state.filter(contact => contact.id !== id)]
        })
    }

    const removeScheduledContact = (id) => {
        return deleteReq({}, `/scheduled-contact/${id}`)
            .then(() => {
                removeFromArray(id);
            });
    }

    return {scheduledContacts, reloadData, loading, removeScheduledContact};
}

export const useAddScheduledContact = () => {

    const {loading, post} = usePost("/scheduled-contact");

    const addScheduledContact = (company, user, contactDate, reminderDate, note) => {
        return post({
            company,
            user,
            contactDate,
            reminderDate,
            note
        })
    }

    return {loading, addScheduledContact};
}

export const useNotificationList = () => {

    const [reload, setReload] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState(false);

    const reloadInterval = 30000;

    useData("/notifications", (data) => {
        console.debug("Loaded notifications")
        data.splice(30)
        setNotifications(data)
        for (let notification of data) {
            if (!notification.seen) {
                setNewNotifications(true);
            }
        }
    }, [reload]);

    const {put} = usePut("/notifications/seen");

    useEffect(() => {
        const interval = setInterval(() => setReload((state) => {
            return state + 1
        }), reloadInterval);
        return () => {
            clearInterval(interval);
        };
    }, [])

    const markNotificationsInArray = () => {
        setNotifications(old => {
            return [...old].map(notification => {
                notification.seen = true;
                return notification;
            })
        })
    }

    const markNotificationAsSeen = (ids) => {
        if (ids.length === 0) {
            return;
        }
        return put({
            notifications: ids
        }).then(() => {
            setNewNotifications(false);
            markNotificationsInArray();
        })
    }


    return {notifications, markNotificationAsSeen, newNotifications}
}
