import {Badge, IconButton, Menu, MenuItem, Typography} from "@mui/joy";
import * as PropTypes from "prop-types";
import Link from "@mui/joy/Link";
import {useNotificationList} from "../../data/NotificationData";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {useEffect, useState} from "react";
import NotificationList from "./NotificationList";


const NotificationComponent = ({expanded = true}) => {

    const {newNotifications, notifications, markNotificationAsSeen} = useNotificationList();

    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        if (!expanded) {
            setAnchorEl(null);
        }
    }, [expanded])

    const handleClose = () => {
        markNotificationAsSeen(notifications.map(notification => notification.id) || []);
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                 onClick={handleClick}>
                {newNotifications ?
                        <Badge color={"primary"}>
                            <NotificationsIcon/>
                        </Badge> :
                   <NotificationsIcon/>}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <div  style={{padding: 0, margin: 0}}>
                    <NotificationList notifications={notifications} handleClose={handleClose}/>
                    <MenuItem onClick={handleClose}>
                        <Link>Zamknij</Link>
                    </MenuItem>
                </div>
            </Menu>
        </div>
    );
};

export default NotificationComponent;